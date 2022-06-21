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

## indexing table for responses that include "E@***" codes.

| Error Code  | Function                 |
| :---:       | :----:                   |
| **File:**   | ***./controllers/translation.js*** |
| 100         | getAllTranslations       |
| 101         | getAllByLanguageKey      |
| 102         | getApprovedTranslationsByLanguageKey |
| 103         | getByVersion             |
| 104         | addNewTranslation        |
| 105         | generateNewVersion       |
| 106         | updateStatus             |
| 107         | deleteByVersion          |
| **File:**   | ***./controllers/information.js*** |
| 108         | getAll                   |
| 109         | get                      |
| 110         | add                      |
| 111         | update                   |
| 112         | addVersion               |
| 113         | deleteOne                |
