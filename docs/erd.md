erDiagram
    USERS {
        int id PK
        string username
        string email
        string password_hash
        datetime created_at
        string role
    }

    EMPLOYERS {
        int id PK
        int user_id FK
        string name
        string email
        string company_name
        string contact_person
        string password_hash
        datetime created_at
    }

    JOBS {
        int id PK
        string title
        string description
        string location
        float salary
        datetime created_at
        int employer_id FK
    }

    APPLICATIONS {
        int id PK
        int user_id FK
        int job_id FK
        string status
        datetime created_at
    }

    PROFILES {
        int id PK
        int user_id FK
        string full_name
        string bio
        datetime created_at
    }

    USERS ||--o{ APPLICATIONS : "applies"
    JOBS ||--o{ APPLICATIONS : "has"
    EMPLOYERS ||--o{ JOBS : "posts"
    USERS ||--|| PROFILES : "profile"
    USERS ||--|| EMPLOYERS : "employer_profile"
