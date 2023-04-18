# GadukaZluka.io
### Чат-приложение для общения в реальном времени
## Запуск сервера
###### *Следующие инструкции приведены для ОС Linux, однако при желании данный сервер можно запустить и под Windows.*

Для начала, нужно скачать проект в удобную для вас папку. В данном примере мы скачаем проект в `/home/gaduka_zluka`.

Перед запуском проекта стоит установить все зависимые библиотеки с помощью следующей комманды:
```bash
$ python -m pip install -r requirements.txt
```

Устанавливаем пакет `gunicorn`:
```bash
$ python -m pip install gunicorn
```

Теперь, желательно узнать IP адрес вашей машины с помощью комманды `ifconfig` или `hostname -I`.

В итоге, запустить сервер можно следующей коммандой:
```bash
$ DB_PATH=sqlite:////home/gaduka_zluka/database/database.db gunicorn -b <ваш ip адрес>:80 -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker main:app
```

Теперь, чтобы превратить процесс в фоновый, мы должны нажать сочетание клавиш `Ctrl+Z` и ввести следующие комманды:
```bash
$ disown -h %1
$ bg
```

##### Запуск сервера под Windows в development-режиме
###### *Данная инструкция может быть полезна тем, кто хочет попробовать запустить наше приложение на своём компьютере под ОС Windows без применения WSGI.*

После того, как вы скачали проект, рекомендуем создать отдельный файл `app.py`, который будет запускать сервер с временными переменными окружения:
```python
import subprocess
import sys
import os

subprocess.run("python main.py", env={
    **os.environ,
    "HOST": "<ваш ip адрес>",
    "DB_PATH": "sqlite:///<путь, где будет храниться база данных>"
})
```
Теперь, всё что останется сделать - это запустить проект коммандой:
```bash
$ python app.py
```
и перейти по ссылке `http://<ваш ip>:8080/`.

## How to contribute
Если у вас появилась идея, которой по вашему мнению не хватает в проекте, то вы можете сделать собственный форк проекта, реализовать вашу идею и отправить нам Pull Request с описанием работы вашей идеи, который мы рассмотрим и примем, если посчитаем вашу идею хорошей и действительно нужной в проекте.

*Отметим, что в случае введения идеи, затрагивающей код фронтэнда и сервера, вовсе не обязательно предоставлять нам код фронтэнда; вам достаточно описать, как работает ваша идея и интерфейсы, которая она вводит ( например, новый интерфейс сообщения ). Если нам понадобится что-нибудь ещё, мы обязательно вас об этом попросим.*