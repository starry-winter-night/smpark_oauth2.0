my-oauth-server/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── User.js
│   │   │   ├── Client.js
│   │   │   ├── Token.js
│   │   │   └── ...
│   │   └── services/
│   │       ├── authService.js
│   │       └── tokenService.js
│   ├── application/
│   │   ├── usecases/
│   │   │   ├── AuthenticateUser.js
│   │   │   ├── GenerateToken.js
│   │   │   └── ...
│   │   └── interfaces/
│   │       ├── UserRepository.js
│   │       ├── ClientRepository.js
│   │       └── ...
│   ├── infrastructure/
│   │   ├── repository/
│   │   │   ├── userRepositoryImpl.js
│   │   │   ├── clientRepositoryImpl.js
│   │   │   └── ...
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── index.js
│   │       │   └── ...
│   │       └── token/
│   │           ├── index.js
│   │           └── ...
│   ├── adapters/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── tokenController.js
│   │   │   └── ...
│   │   ├── dtos/
│   │   │   ├── userDTO.js
│   │   │   └── ...
│   │   ├── mappers/
│   │   │   ├── userMapper.js
│   │   │   └── ...
│   ├── utils/
│   │   ├── hashUtil.js
│   │   └── ...
├── public/
│   └── ...
├── styles/
│   └── ...
├── .gitignore
├── package.json
└── README.md
