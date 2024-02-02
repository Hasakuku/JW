📦src
 ┣ 📂apis
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜auth-user.dto.ts
 ┃ ┃ ┃ ┗ 📜send-code.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜auth-code.entity.ts
 ┃ ┃ ┣ 📂social
 ┃ ┃ ┃ ┣ 📜google.strategy.ts
 ┃ ┃ ┃ ┣ 📜facebook.strategy.ts
 ┃ ┃ ┃ ┗ 📜kakao.strategy.ts
 ┃ ┃ ┣ 📜jwt.strategy.ts
 ┃ ┃ ┣ 📜auth.controller.ts
 ┃ ┃ ┣ 📜auth.service.ts
 ┃ ┃ ┗ 📜auth.module.ts
 ┃ ┣ 📂users
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜create-user.dto.ts
 ┃ ┃ ┃ ┗ 📜update-code.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜user.entity.ts
 ┃ ┃ ┣ 📜users.controller.ts
 ┃ ┃ ┣ 📜users.service.ts
 ┃ ┃ ┗ 📜users.module.ts
 ┃ ┣ 📂meetings
 ┃ ┃ ┣ 📜meetings.controller.ts
 ┃ ┃ ┣ 📜meetings.service.ts
 ┃ ┃ ┗ 📜meetings.module.ts
 ┣ 📂common
 ┃ ┣ 📂guards
 ┃ ┃ ┗ 📜a.guard.ts
 ┃ ┣ 📂decorators
 ┃ ┃ ┗ 📜a.decorator.ts
 ┃ ┣ 📂filters
 ┃ ┃ ┗ 📜a.filter.ts
 ┃ ┗ 📂interceptors
 ┃   ┗ 📜a.interceptor.ts
 ┣ 📂config
 ┃ ┣ 📜typeOrm.config.ts
 ┃ ┗ 📜configuration.ts
 ┣ 📂database
 ┃ ┣ 📂entities
 ┃ ┃ ┗ 📜e.entity.ts
 ┃ ┗ 📂migrations
 ┃   ┗ 📜{migration_timestamp}-{migration_name}.ts
 ┣ 📂constant
 ┃ ┣ 📂messages
 ┃ ┃ ┗ 📜messages.entity.ts
 ┃ ┣ 📜error.messages.ts
 ┃ ┗ 📜success.messages.ts
 ┣ 📂modules
 ┃ ┗ 📜app.module.ts
 ┗ 📜main.ts
