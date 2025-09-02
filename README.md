# 🏠 Gestão da Casa

Um sistema simples e elegante para gerir inquilinos, quartos e despesas mensais de uma casa, com integração Firebase e automatização de emails via n8n.

---

## ✨ Funcionalidades

*   **Dashboard Interativo:** Visualize e gere relatórios de despesas mensais por inquilino.
*   **Gestão de Inquilinos:** Crie, edite, ative/desative inquilinos com dados detalhados.
*   **Gestão de Quartos:** Crie, edite quartos e visualize o seu estado de ocupação.
*   **Relatório de Despesas da Casa:** Registe e edite as despesas gerais mensais da casa (gás, água, eletricidade).
*   **Cálculo Automático de Despesas:** Calcule e distribua as despesas gerais pelos inquilinos ativos.
*   **Envio de Emails Personalizados:** Selecione e envie emails de despesas aos inquilinos via n8n.
*   **Autenticação Segura:** Protegido por login de utilizador via Firebase Authentication.
*   **Design Moderno:** Interface apelativa e responsiva com Bootstrap 5.

---

## 🚀 Pré-requisitos

Antes de começar, certifique-se de que tem o seguinte instalado:

*   **Node.js e npm:** [Download aqui](https://nodejs.org/en/download/)
*   **Conta Firebase:** Um projeto Firebase configurado com **Firestore Database** e **Authentication (Email/Password)** ativados.
*   **Instância n8n (Opcional):** Para a funcionalidade de envio de emails. Pode ser local ou cloud.

---

## ⚙️ Configuração do Projeto

Siga estes passos para configurar o projeto no seu ambiente local:

1.  **Clone o Repositório / Descarregue os Ficheiros:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    # OU descarregue os ficheiros diretamente para uma pasta
    ```

2.  **Instale as Dependências:**
    Navegue até à pasta do projeto no seu terminal e execute:
    ```bash
    npm install
    ```

3.  **Configure o Ficheiro `.env`:**
    Este ficheiro contém as suas credenciais do Firebase e **NÃO DEVE SER PARTILHADO PUBLICAMENTE (ex: GitHub)**.

    *   Crie uma cópia do ficheiro `.env.example` e renomeie-a para `.env`.
    *   Abra o ficheiro `.env` e preencha com as suas credenciais do Firebase. Pode encontrá-las no seu [Firebase Console](https://console.firebase.google.com/) em **Project settings (⚙️) > General > Your apps > Web app > Config**.

    ```env
    API_KEY="SEU_API_KEY"
    AUTH_DOMAIN="SEU_AUTH_DOMAIN"
    PROJECT_ID="SEU_PROJECT_ID"
    STORAGE_BUCKET="SEU_STORAGE_BUCKET"
    MESSAGING_SENDER_ID="SEU_MESSAGING_SENDER_ID"
    APP_ID="SEU_APP_ID"
    MEASUREMENT_ID="SEU_MEASUREMENT_ID"
    ```

4.  **Configure as Regras de Segurança do Firebase Firestore:**
    Para permitir que a aplicação leia e escreva dados após o login, configure as suas regras do Firestore.

    *   No [Firebase Console](https://console.firebase.google.com/), vá a **Build > Firestore Database > Rules**.
    *   Substitua o conteúdo existente pelas seguintes regras e clique em **Publicar**:

    ```firestore
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          // Permite ler e escrever APENAS se o pedido vier de um utilizador autenticado.
          allow read, write: if request.auth != null;
        }
      }
    }
    ```

5.  **Crie o seu Utilizador Administrador no Firebase:**
    *   No [Firebase Console](https://console.firebase.google.com/), vá a **Build > Authentication > Users**.
    *   Clique em **Add user** e crie um utilizador com um email e password. Estas serão as credenciais que usará para fazer login na aplicação.

---

## ▶️ Como Correr a Aplicação

1.  **Inicie o Servidor:**
    No terminal, na pasta do projeto, execute:
    ```bash
    node server.js
    ```
    Deverá ver uma mensagem como: `Server running at http://localhost:3000`

2.  **Aceda no Navegador:**
    Abra o seu navegador e vá para:
    [http://localhost:3000](http://localhost:3000)

    Será redirecionado para a página de login. Use as credenciais que criou no Firebase.

---

## 📧 Configuração do n8n (Opcional: Para Envio de Emails)

Para que o botão "Enviar Email Despesas" funcione, precisa de configurar um workflow no n8n:

1.  **Crie um Novo Workflow no n8n:**
    *   Adicione um nó **Webhook** como gatilho.
    *   Copie o **URL de Teste (Test URL)** que o nó do Webhook lhe fornece.
    *   Cole este URL na variável `N8N_WEBHOOK_URL` no topo do script `index.html` (dentro da tag `<script type="module">`).

2.  **Envie Dados de Teste da Aplicação:**
    *   Na sua aplicação web, vá ao Dashboard, clique em "Enviar Email Despesas", selecione alguns relatórios e clique em "Enviar Emails".
    *   No n8n, no nó do Webhook, clique em **"Fetch test event"**. Deverá ver os dados que a aplicação enviou (um array de objetos `reports`, cada um com os detalhes do relatório e o `tenantEmail`).

3.  **Construa o Workflow de Envio de Email:**
    *   **Webhook** (Trigger)
    *   **Split In Batches** (para processar cada email individualmente, se enviar vários)
        *   `Mode`: `Split In Batches`
        *   `Batch Size`: `1`
    *   **Gmail** (para enviar o email)
        *   **Credencial:** Crie uma nova credencial. A forma mais segura é usar uma **App Password** da sua conta Google. [Ajuda da Google para criar App Password](https://support.google.com/accounts/answer/185833)
        *   **To:** `{{ $json.tenantEmail }}` (ou o campo de email que obteve do nó Firebase anterior)
        *   **Subject:** `Despesas da Casa - Mês {{ $json.month }}`
        *   **HTML Body:** Pode usar um template como este, adaptando os campos `{{ $json.campo }}` aos dados que o seu Webhook está a receber:

        ```html
        <p>Olá {{ $json.tenantName }},</p>
        <p>Aqui estão os detalhes das tuas despesas para o mês de <b>{{ $json.month }}</b>:</p>
        <ul>
            <li>Renda do Quarto: <b>{{ $json.rent }}€</b></li>
            <li>Gás: {{ $json.gas }}€</li>
            <li>Água: {{ $json.water }}€</li>
            <li>Eletricidade: {{ $json.electricity }}€</li>
        </ul>
        <p>Total a pagar: <b>{{ $json.total }}€</b></p>
        <p>Obrigado!</p>
        ```
    *   **Ative o Workflow:** Depois de configurar, ative o workflow no n8n.

---

## ⚠️ Resolução de Problemas Comuns

*   **`Cannot GET /`:**
    *   Certifique-se de que o servidor `server.js` está a correr.
    *   Verifique se o ficheiro principal se chama `index.html` (e não `site.html`).
*   **Login não funciona / Dados não aparecem:**
    *   Verifique a consola do navegador (F12) para erros.
    *   Confirme que o seu ficheiro `.env` está correto e na pasta raiz do projeto.
    *   Certifique-se de que o método de login "Email/Password" está ativado no Firebase Authentication e que criou um utilizador.
    *   Verifique as suas regras do Firestore. Devem ser `allow read, write: if request.auth != null;` para utilizadores autenticados.
*   **`Firebase: Error (auth/invalid-api-key).`:**
    *   A sua `API_KEY` no `.env` está incorreta ou o seu projeto Firebase não está configurado corretamente para a web.

---
