# language_service

## How to run

```bash
yarn
yarn dev # nodemon
```

```bash
yarn start # node
```

## Initial Auth0 setup

TODO

## Deployment notes

TODO

## indexing table for responses that include "internal_code" / "error_code" (developers only)

TODO: change logic

| Error Code  | Function                 | File                         |
| :---:       |    :----:                |        :---:                 |
| 100         | getAllTranslations       | ./controllers/translation.js |
| 101         | getAllByKey              | ./controllers/translation.js |
| 102         | getApprovedTranslation   | ./controllers/translation.js |
| 103         | getByVersion             | ./controllers/translation.js |
| 104         | addNewTranslation        | ./controllers/translation.js |
| 105         | generateNewVersion       | ./controllers/translation.js |
| 106         | deleteByVersion          | ./controllers/translation.js |
| 108         | func                     | path                         |
| 109         | func                     | path                         |
| 110         | func                     | path                         |
| 111         | func                     | path                         |
| 112         | func                     | path                         |
| 113         | func                     | path                         |
