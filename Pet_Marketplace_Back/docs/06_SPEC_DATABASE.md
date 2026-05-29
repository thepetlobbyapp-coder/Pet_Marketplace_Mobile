# SPEC_DATABASE — Banco de Dados

**Versão:** 1.1  
**Banco:** Supabase PostgreSQL + PostGIS  
**Fase:** 1

---

## 1. Princípios

- PostgreSQL é o banco principal.
- PostGIS deve ser usado para busca por proximidade.
- Dados pessoais devem ser minimizados.
- Coordenadas exatas não devem ser expostas a terceiros.
- Toda entidade crítica deve ter `created_at`, `updated_at` e, quando fizer sentido, `deleted_at`.
- Migrations devem ser versionadas.
- Status críticos devem ter histórico.
- Não depender apenas do mobile para regras de segurança.

---

## 2. Extensões

```sql
create extension if not exists postgis;
create extension if not exists pgcrypto;
```

---

## 3. Enums sugeridos

```txt
user_status: active, blocked, deleted
profile_type: tutor, provider, admin
pet_species: dog, cat, other
pet_size: small, medium, large, giant, unknown
service_type: dog_walking, pet_sitting_at_owner_home, quick_visit, feeding, companionship
booking_status: requested, accepted, declined, cancelled, completed
report_status: open, in_review, action_taken, dismissed, closed
report_category: safety_concern, inappropriate_behaviour, harassment, spam_scam, no_show, other
review_status: visible, hidden, reported
message_status: sent, deleted_by_moderation
```

---

## 4. Tabelas principais

### 4.1 `users`

Conta base.

Campos:

- `id uuid primary key`
- `email text unique not null`
- `phone text null`
- `status user_status not null default 'active'`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`
- `deleted_at timestamptz null`

### 4.2 `user_roles`

Permite múltiplos papéis no futuro.

- `id uuid primary key`
- `user_id uuid references users(id)`
- `role profile_type not null`
- unique (`user_id`, `role`)

### 4.3 `tutor_profiles`

- `id uuid primary key`
- `user_id uuid references users(id)`
- `display_name text not null`
- `default_address_id uuid null`
- `created_at timestamptz`
- `updated_at timestamptz`

### 4.4 `pets`

- `id uuid primary key`
- `tutor_profile_id uuid references tutor_profiles(id)`
- `name text not null`
- `species pet_species not null`
- `breed text null`
- `size pet_size null`
- `age_range text null`
- `notes text null`
- `created_at timestamptz`
- `updated_at timestamptz`
- `deleted_at timestamptz null`

### 4.5 `provider_profiles`

- `id uuid primary key`
- `user_id uuid references users(id)`
- `display_name text not null`
- `bio text null`
- `base_address_id uuid null`
- `service_radius_km numeric(5,2) not null default 5`
- `status text not null default 'active'`
- `rating_average numeric(3,2) null`
- `rating_count integer not null default 0`
- `created_at timestamptz`
- `updated_at timestamptz`

Não usar status/label `verified` na Fase 1.

### 4.6 `provider_services`

- `id uuid primary key`
- `provider_profile_id uuid references provider_profiles(id)`
- `service_type service_type not null`
- `description text null`
- `price_amount numeric(10,2) null`
- `currency char(3) not null default 'GBP'`
- `is_active boolean not null default true`
- `created_at timestamptz`
- `updated_at timestamptz`

### 4.7 `addresses`

- `id uuid primary key`
- `user_id uuid references users(id)`
- `label text null`
- `country_code char(2) not null default 'GB'`
- `line1 text null`
- `city text null`
- `postcode text null`
- `formatted_address text null`
- `location geography(Point, 4326) not null`
- `location_precision text not null default 'approximate'`
- `created_at timestamptz`
- `updated_at timestamptz`

Índice:

```sql
create index addresses_location_gix on addresses using gist (location);
```

### 4.8 `availability_rules`

- `id uuid primary key`
- `provider_profile_id uuid references provider_profiles(id)`
- `weekday smallint not null`
- `time_slot_id text not null`
- `is_active boolean not null default true`

Regras:

- `weekday` usa `0` domingo ate `6` sabado;
- `time_slot_id` usa slots de 1 hora entre `08:00` e `19:00`;
- chave unica por `provider_profile_id, weekday, time_slot_id`.

### 4.9 `bookings`

- `id uuid primary key`
- `tutor_profile_id uuid references tutor_profiles(id)`
- `provider_profile_id uuid references provider_profiles(id)`
- `pet_id uuid references pets(id)`
- `service_type service_type not null`
- `status booking_status not null default 'requested'`
- `booking_date date not null`
- `time_slot_id text not null` legado/primeiro slot
- `price_per_hour_snapshot numeric(10,2) not null`
- `estimated_total_amount numeric(10,2) not null`
- `currency text not null default 'GBP'`
- `notes text null`
- `created_at timestamptz`
- `updated_at timestamptz`

Índices:

- `provider_id, booking_date`
- `tutor_profile_id, booking_date`
- `status`

### 4.9.1 `booking_slots`

- `id uuid primary key`
- `booking_id uuid references bookings(id)`
- `provider_id uuid references providers(id)`
- `booking_date date not null`
- `time_slot_id text not null`
- `status booking_status not null default 'requested'`
- `created_at timestamptz`
- `updated_at timestamptz`

Indices:

- `booking_id`
- `provider_id, booking_date`
- unico parcial `provider_id, booking_date, time_slot_id` para status
  `requested` e `confirmed`.

Regra: bookings multi-horario sao uma solicitacao agrupada; `booking_slots`
e a fronteira de concorrencia que impede dois tutores de segurar o mesmo slot
ativo.

### 4.10 `booking_status_history`

- `id uuid primary key`
- `booking_id uuid references bookings(id)`
- `from_status booking_status null`
- `to_status booking_status not null`
- `changed_by_user_id uuid references users(id)`
- `reason text null`
- `created_at timestamptz`

### 4.11 `chat_messages`

- `id uuid primary key`
- `booking_id uuid references bookings(id)`
- `sender_user_id uuid references users(id)`
- `body text not null`
- `status message_status not null default 'sent'`
- `created_at timestamptz`

Regras:

- body limitado na aplicação e banco;
- sem anexos na Fase 1.

### 4.12 `reviews`

- `id uuid primary key`
- `booking_id uuid references bookings(id)`
- `reviewer_user_id uuid references users(id)`
- `reviewee_user_id uuid references users(id)`
- `rating smallint not null check (rating between 1 and 5)`
- `comment text null`
- `status review_status not null default 'visible'`
- `created_at timestamptz`

Unique:

- `booking_id, reviewer_user_id`

### 4.13 `reports`

- `id uuid primary key`
- `reporter_user_id uuid references users(id)`
- `target_type text not null`
- `target_id uuid not null`
- `category report_category not null`
- `description text null`
- `status report_status not null default 'open'`
- `assigned_admin_id uuid null`
- `created_at timestamptz`
- `updated_at timestamptz`

### 4.14 `admin_notes`

- `id uuid primary key`
- `admin_user_id uuid references users(id)`
- `target_type text not null`
- `target_id uuid not null`
- `note text not null`
- `created_at timestamptz`

### 4.15 `audit_logs`

- `id uuid primary key`
- `actor_user_id uuid null`
- `action text not null`
- `target_type text null`
- `target_id uuid null`
- `metadata jsonb null`
- `created_at timestamptz`

---

## 5. Consulta PostGIS sugerida

Exemplo conceitual:

```sql
select
  pp.id,
  pp.display_name,
  round((st_distance(a.location, st_makepoint(:lng, :lat)::geography) / 1000)::numeric, 1) as distance_km
from provider_profiles pp
join addresses a on a.id = pp.base_address_id
where st_dwithin(
  a.location,
  st_makepoint(:lng, :lat)::geography,
  (:radius_km * 1000)
)
and pp.status = 'active'
and pp.service_radius_km >= (st_distance(a.location, st_makepoint(:lng, :lat)::geography) / 1000)
order by distance_km asc
limit :limit offset :offset;
```

### 5.1 RPC `providers_list_near` (descoberta no marketplace)

A listagem do marketplace é servida pela função `security definer`
`providers_list_near(p_user_id, p_category, p_search, p_limit, p_offset)`.
O centro do cálculo é o **endereço padrão do tutor autenticado**
(`tutor_profiles.default_address_id`), e o raio aplicado é o **raio de
atendimento de cada prestador** (`provider_profiles.service_radius_km`):

```sql
st_dwithin(tutor.location, provider.base_address.location, service_radius_km * 1000)
```

Regras e efeitos colaterais intencionais:

- `st_dwithin(geography, geography, metros)` usa o índice GiST de
  `addresses.location` (ao contrário de `st_distance` no `ORDER BY`);
- `distance_meters` é **aproximado** (arredondado para a dezena de metros);
- o próprio anúncio do usuário é excluído (`pp.user_id <> p_user_id`);
- tutor sem endereço padrão recebe lista vazia (precondição de endereço sem erro
  duro durante o onboarding);
- prestador sem `base_address` nunca aparece (regra "publicar exige endereço base");
- `providers_get_one` **não** aplica o filtro de raio: o detalhe alimenta o fluxo
  de agendamento e precisa continuar acessível mesmo fora do raio do tutor.

---

## 6. RLS e autorização

Mesmo usando backend como autoridade, considerar RLS para:

- usuário acessar apenas seus pets;
- usuário acessar apenas seus endereços;
- mensagens somente de bookings participantes;
- admin com policies separadas.

O backend não deve usar service role key no cliente.

---

## 7. Dados fora da Fase 1

Não criar tabelas de:

- pagamentos;
- payouts;
- ledger;
- cartão;
- Stripe account;
- Wise transfer;
- documentos obrigatórios;
- DBS checks;
- home boarding licence.

Pode reservar nomes/arquitetura para Fase 2, mas sem implementação ativa.
