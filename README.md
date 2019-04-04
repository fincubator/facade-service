# FACADE-SERVICE

**FACADE-SERVICE** является микросервисом роутинга запросов между фронтендом и микросервисами [golos.io](https://golos.io).
Для работы сервису необходим совместимый фронтенд-гейт, осуществляющий конечное общение с фронтендом и авторизацию входящих запросов.

##### API JSON-RPC

Общий формат всех входящих запросов из гейта должен строго соответствовать этому формату:

_(для внутренних запросов формат может быть любой, смотри также transfer в секции про внутренние запросы)_

```
auth:
    user <string>              // Имя пользователя, определенное сервисом авторизации
                               // может отсутствовать для анонимных запросов
    roles [<string>]           // Роли пользователя, определенные сервисом авторизации
                               // может быть пустым

routing:
    channelId <string>         // Идентификатор канала передачи данных,
                               // указывающий по какому каналу нужно будет передать ответ,
                               // актуально для запросов-подписок

    requestId <number|string>  // Идентификатор запроса в виде порядкового числа или уникальной строки,
                               // может использоваться для понимания очередности запросов
                               // или для запросов-подписок

_frontendGate <boolean>    // Флаг того что запрос был отправлен из фронтенд-гейта,
                           // необходим для автоматической фильтрации внешних запросов,
                           // которые не допустимы для внутренних методов

params <Object>            // Входящие параметры запроса, те самые параметры что попадают
                           // в фронтенд-гейт как входящий запрос, всё остальное выше
                           // определяется автоматически на уровне гейта
```

Детальное описание:

```
offline:                  // Оповещает все заинтересованные сервисы о том что пользователь офлайн
    user <string>         // Имя пользователя
    channelId <string>    // Идентификатор канала передачи данных


options.get:              // Запрос на получение настрек пользователя
                          // Автоматически создает дефолтные настройки при первом запросе
    user <string>         // Имя пользователя
    params:               // Параметры запроса из гейта
        profile <string>  // Идентификатор профиля пользователя

options.set:              // Запрос на установку настроек пользователя
    user <string>         // Имя пользователя
    params:               // Параметры запроса из гейта
        profile <string>  // Идентификатор профиля пользователя
        basic <Object>    // Объект базовых настроек, на данный момент не стандартизирован
        notify <Object>   // Объект настроек онлайн уведомлений
        push <Object>     // Объект настроек push-нотификаций

onlineNotify.on:               // Подписывает на онлайн оповещения для пользователя
    user <string>              // Имя пользователя
    channelId <string>         // Идентификатор канала передачи данных
    requestId <number|string>  // Идентификатор запроса в виде порядкового числа или уникальной строки

onlineNotify.off:              // Отписывает от онлайн оповещений для пользователя
    user <string>              // Имя пользователя
    channelId <string>         // Идентификатор канала передачи данных

onlineNotify.history:                  // Получение истории нотификаций с учетом настроек пользователя
    user <string>                      // Имя пользователя
    params:                            // Параметры запроса из гейта
        fromId <string|null>(null)     // ID с которого нужно начать показывать историю, опционально
        limit <number>(10)             // Необходимое количество строк истории
        markAsViewed <boolean>(true)   // Пометить ли все выгруженные записи как прочитанные
        freshOnly <boolean>(false)     // Возвратить только непрочитанные данные

onlineNotify.historyFresh:  // Получение количества непрочитанных нотификаций с учетом настроек пользователя
    user <string>           // Имя пользователя

push.notifyOn:              // Подписывает на push-оповещения для пользователя по профилю
    user <string>           // Имя пользователя
    params:                 // Параметры запроса из гейта
        key <string>        // Ключ рассылки нотификации
        profile <string>    // Идентификатор профиля пользователя

push.notifyOff:             // Отписывает от push-оповещений для пользователя по профилю
    user <string>           // Имя пользователя
    params:                 // Параметры запроса из гейта
        key <string>        // Ключ рассылки нотификации
        profile <string>    // Идентификатор профиля пользователя

push.history:                              // Получение истории нотификаций с учетом настроек пользователя
    user <string>                          // Имя пользователя
    params:                                // Параметры запроса из гейта
        profile <profile>                  // Профиль пользователя
        afterId <string|null>(null)        // ID после которого нужно начать показывать историю, опционально
        limit <number>(10)                 // Необходимое количество строк истории
        markAsViewed <boolean>(true)       // Пометить ли все выгруженные записи как прочитанные
        freshOnly <boolean>(false)         // Возвратить только непрочитанные данные
        types <string[]|'all'|null>(null)  // Массив необходимых типов нотификаций из которого будут вычтены те типы,
                                           // которые пользователь отключил в своих настройках.
                                           // Отсутствие параметра эквивалентно запросу 'all', который возвращает
                                           // все доступные типы согласно настройкам пользователя.
            [
             vote                          // лайк (голос)
            | flag                         // флаг (дизлайк, жалоба)
            | transfer                     // перевод средств
            | reply                        // ответ на пост или комментарий
            | subscribe                    // подписка на блог
            | unsubscribe                  // отписка от блога
            | mention                      // упоминание в посте, заголовке поста или в комменте (через @)
            | repost                       // репост
            | reward                       // награда пользователю
            | curatorReward                // награда куратору
            | message                      // личное сообщение (не реализованно в данной версии)
            | witnessVote                  // голос за делегата
            | witnessCancelVote            // отмена голоса за делегата
            ]

push.historyFresh:                     // Получение количества непрочитанных нотификаций с учетом настроек пользователя
    user <string>                      // Имя пользователя
    params:                            // Параметры запроса из гейта
        profile <profile>              // Профиль пользователя

notify.getHistory:                     // Получение истории нотификаций
    user <string>                      // Имя пользователя
    params:                            // Параметры запроса из гейта
        fromId <string|null>(null)     // ID с которого нужно начать показывать историю, опционально
        limit <number>(10)             // Необходимое количество строк истории
        markAsViewed <boolean>(true)   // Пометить ли все выгруженные записи как прочитанные
        freshOnly <boolean>(false)     // Возвратить только непрочитанные данные
        types <'all'|string[]>('all')  // Массив необходимых типов нотификаций или 'all' если нужны все
            [
              vote               // лайк (голос)
            | flag               // флаг (дизлайк, жалоба)
            | transfer           // перевод средств
            | reply              // ответ на пост или комментарий
            | subscribe          // подписка на блог
            | unsubscribe        // отписка от блога
            | mention            // упоминание в посте, заголовке поста или в комменте (через @)
            | repost             // репост
            | reward             // награда пользователю
            | curatorReward      // награда куратору
            | message            // личное сообщение (не реализованно в данной версии)
            | witnessVote        // голос за делегата
            | witnessCancelVote  // отмена голоса за делегата
            ]

notify.getHistoryFresh:      // Получение количества непрочитанных нотификаций
    user <string>            // Имя пользователя

notify.markAsViewed:         // Пометить указанные нотификации как не новые (`fresh: false`)
    user <string>            // Имя пользователя
    params:                  // Параметры запроса из гейта
        ids <string[]>       // Список идентификаторов для пометки

notify.markAllAsViewed:      // Пометить все нотификации как не новые (`fresh: false`)
    user <string>            // Имя пользователя

notify.markAsRead:           // Пометить указанные нотификации как прочитанные (`unread: false`)
    user <string>            // Имя пользователя
    params:                  // Параметры запроса из гейта
        ids <string[]>       // Список идентификаторов для пометки

notify.markAllAsRead:        // Пометить все нотификации как прочитанные (`unread: false`)
    user <string>            // Имя пользователя

notify.getBlackList:         // Возвращает черный список пользователя
     <empty>                 // Без параметров

notify.addToBlackList:       // Добавляет пользователя в черный список
     banned <string>         // Имя пользователя для добавления

notify.removeFromBlackList:  // Исключает пользователя из черного списка
     banned <string>         // Имя пользователя для исключения

favorites.get:               // Получить избранные посты пользователя
    user <string>            // Имя пользователя

favorites.add:               // Добавить пост в избранные
    user <string>            // Имя пользователя
    params:                  // Параметры запроса из гейта
        permlink <string>    // Пермлинк поста

favorites.remove:            // Удалить пост из избранных
    user <string>            // Имя пользователя
    params:                  // Параметры запроса из гейта
        permlink <string>    // Пермлинк поста

meta.markUserOnline:         // Пометить юзера как онлайн
    <empty>                  // Без параметров
```

Апи, доступное без авторизации:

```
frame.getEmbed:             // Сделать запрос к iframely
    params:                 // Параметры запроса из гейта
        type                // Тип (oembed либо iframely)
        url                 // Ссылка на ресурс

registration.getState:      // Получить текущее состояние регистрации
    params:                 // Параметры запроса из гейта
        user                // Имя пользователя

registration.firstStep:     // Сделать первый шаг регистрации
    params:                 // Параметры запроса из гейта
        captcha? <string>   // Верификационный код капчи (если не отключена)
        user <string>       // Имя пользователя
        phone <string>      // Телефон пользователя
        mail <string>       // Почта пользователя

registration.verify:        // Сделать верификацию регистрации (кроме стратегии smsFromUser)
    params:                 // Параметры запроса из гейта
        user <sting>        // Имя пользователя
        code? <string>      // Код из смс (стратегия smsToUser)

registration.toBlockChain:  // Зарегистрировать пользователя в блокчейн
    params:                 // Параметры запроса из гейта
        user <string>       // Имя пользователя
        owner <string>      // Ключ владельца
        active <string>     // Активный ключ
        posting <string>    // Постинг ключ
        memo <string>       // Мемо ключ (ключ заметок)

registration.changePhone:   // Сменить номер телефона (стратегия smsFromUser, smsToUser)
    params:                 // Параметры запроса из гейта
        user <string>       // Имя пользователя
        phone <string>      // Телефон пользователя
        captcha? <string>   // Верификационный код капчи (если не отключена)

registration.resendSmsCode:      // Переотправить код на телефон пользователя (стратегия smsToUser)
    params:                      // Параметры запроса из гейта
        user <string>            // Имя пользователя
        phone <string>           // Телефон пользователя

registration.subscribeOnSmsGet:  // Подписаться на получение смс от пользователя (стратегия smsFromUser)
    channelId <string>           // Идентификатор канала передачи данных
    params:                      // Параметры запроса из гейта
        user <string>            // Имя пользователя
        phone <string>           // Телефон пользователя

rates.getActual:                 // Получить актуальные курсы обмена
     <empty>                     // Без параметров

rates.getHistorical:             // Получить историю курсов обмена
    params:                      // Параметры запроса из гейта
        date <timestamp>         // Необходимая дата

rates.getHistoricalMulti:        // Получить историю курсов обмена для нескольких дат
    params:                      // Параметры запроса из гейта
        dates <timestamp[]>      // Массив необходимых дат

meta.recordPostView              // Запись факта просмотра поста
    params:                      // Параметры запроса из гейта
        postLink <string>        // Полная ссылка на пост author/perm-link
        fingerPrint <string>     // Finger print браузера

meta.getPostsViewCount           // Получить количество просмотров для постов
    params:                      // Параметры запроса из гейта
        postLinks <string[]>     // Список ссылок на посты в формате author/perm-link

meta.getUserLastOnline:          // Получить время (timestamp) последного онлайна пользователей
    params:                      // Параметры запроса из гейта
        user <string>            // Имя пользователя

content.getProfile:                 // Получение профиля пользователя
    params:                         // Параметры запроса из гейта
        userId <string>             // Идентификатор пользователя
        type <string>               // Тип профиля ('gls' либо 'cyber'). По-умолчанию 'gls'

content.getPost:                    // Получение конкретного поста
    params:                         // Параметры запроса из гейта
        userId <string>             // Идентификатор пользователя
        permlink <string>           // Пермлинк поста
        refBlockNum <number>        // Привязанный блок поста
        raw <boolean>(false)        // Получить данные в оригинальном виде и без санитайзинга

content.getComment:                 // Получение конкретного коммента
    params:                         // Параметры запроса из гейта
        userId <string>             // Идентификатор пользователя
        permlink <string>           // Пермлинк поста
        refBlockNum <number>        // Привязанный блок поста
        raw <boolean>(false)        // Получить данные в оригинальном виде и без санитайзинга

content.getFeed:                    // Получение ленты постов
    params:                         // Параметры запроса из гейта
        type <string>('community')  // Тип ленты
            [
              community             // Лента комьюнити, требует communityId
            | subscriptions         // Лента подписок пользователя, требует userId
            | byUser                // Лента постов самого пользователя, требует userId
            ]
        sortBy <string>('time')     // Способ сортировки
            [
              time                  // Сначала старые, потом новые
            | timeDesc              // Сначала новые, потом старые
            | popular               // По популярности (только для community)
            ]
        timeframe <string>('day')   // Область выборки сортировки (только для community + popular)
            [
              day                   // За день
            | week                  // За неделю
            | month                 // За месяц
            | year                  // За год
            | all                   // За всё время
            | WilsonHot             // Aлгоритм Вилсона, актуальный контент сейчас
            | WilsonTrending        // Aлгоритм Вилсона, в целом популярный контент
            ]
        sequenceKey <string/null>   // Идентификатор пагинации для получения следующего контента
        limit <number>              // Количество элементов
        userId <string/null>        // Идентификатор пользователя
        communityId <string>        // Идентификатор комьюнити
        tags <string[]/null>        // Теги для фильтрации (только для community и сортировкой по времени)
        raw <boolean>(false)        // Получить данные в оригинальном виде и без санитайзинга

content.getComments:                // Получение ленты комментариев
    params:                         // Параметры запроса из гейта
        sortBy <string>('time')     // Способ сортировки
            [
              time                  // Сначала старые, потом новые
            | timeDesc              // Сначала новые, потом старые
            ]
        sequenceKey <string/null>   // Идентификатор пагинации для получения следующего контента
        limit <number>(10)          // Количество элементов
        type <string>('post')       // Тип ленты
            [
              post                  // Получить комментарии для поста, требует userId, permlink, refBlockNum
            | user                  // Получить комментарии пользователя, требует userId
            | replies               // Получить комментарии, которые были оставлены пользователю, требует userId
            ]
        userId <string/null>        // Идентификатор пользователя
        permlink <string/null>      // Пермлинк поста
        refBlockNum <number/null>   // Привязанный блок поста
        raw <boolean>(false)        // Получить данные в оригинальном виде и без санитайзинга

getHashTagTop:                      // Получение топа хеш-тегов
    params:                         // Параметры запроса из гейта
        communityId <string>        // Идентификатор комьюнити
        limit <number>(10)          // Количество элементов
        sequenceKey <string/null>   // Идентификатор пагинации для получения следующего контента
```

Апи для обращения из внутренних микросервисов:

```
transfer:                         // Переправить данные пользователю в виде JSON-RPC нотификации
    channelId <string>            // Идентификатор канала передачи данных
    method <string>               // Имя RPC метода
    error <Object|null>           // Объект ошибки (нет если есть result)
    result <Object|null>          // Объект данных (нет если есть error)
    _frontendGate <boolean|null>  // Флаг того что запрос был отправлен из гейта
                                  // В случае true - запрос будет заблокирован
```

### Переменные окружения

Возможные переменные окружения `ENV`:

-   `GLS_FRONTEND_GATE_CONNECT` _(обязательно)_ - адрес подключения к микросервису фронтенд-гейту.

-   `GLS_ONLINE_NOTIFY_CONNECT` _(обязательно)_ - адрес подключения к микросервису онлайн нотификаций.

-   `GLS_NOTIFY_CONNECT` _(обязательно)_ - адрес подключения к микросервису регистрации нотификаций.

-   `GLS_OPTIONS_CONNECT` _(обязательно)_ - адрес подключения к микросервису настроек.

-   `GLS_PUSH_CONNECT` _(обязательно)_ - адрес подключения к микросервису рассылки push-уведомлений.

-   `GLS_MAIL_CONNECT` _(обязательно)_ - адрес подключения к микросервису рассылки писем.

-   `GLS_REGISTRATION_CONNECT` _(обязательно)_ - адрес подключения к микросервису регистрации пользователей.

-   `GLS_RATES_CONNECT` _(обязательно)_ - адрес подключения к микросервису хранящему курсы валют.

-   `GLS_PRISM_CONNECT` _(обязательно)_ - адрес подключения к микросервису призма.

-   `GLS_META_CONNECT` _(обязательно)_ - адрес подключения к микросервису мета данных.

-   `GLS_BANDWIDTH_PROVIDER_CONNECT` _(обязательно)_ - адрес подключения к микросервису бэндвича.

-   `GLS_IFRAMELY_CONNECT` _(обязательно)_ - адрес подключения к микросервису Iframely.

-   `GLS_CONNECTOR_HOST` _(обязательно)_ - адрес, который будет использован для входящих подключений связи микросервисов.  
    Дефолтное значение при запуске без докера - `127.0.0.1`

-   `GLS_CONNECTOR_PORT` _(обязательно)_ - адрес порта, который будет использован для входящих подключений связи микросервисов.  
    Дефолтное значение при запуске без докера - `3000`, пересекается с `GLS_FRONTEND_GATE_PORT`

-   `GLS_METRICS_HOST` _(обязательно)_ - адрес хоста для метрик StatsD.  
    Дефолтное значение при запуске без докера - `127.0.0.1`

-   `GLS_METRICS_PORT` _(обязательно)_ - адрес порта для метрик StatsD.  
    Дефолтное значение при запуске без докера - `8125`

-   `GLS_MONGO_CONNECT` - строка подключения к базе MongoDB.  
    Дефолтное значение - `mongodb://mongo/admin`

-   `GLS_DAY_START` - время начала нового дня в часах относительно UTC.
    Дефолтное значение - `3` (день начинается в 00:00 по Москве).

### Запуск

Для запуска достаточно вызвать команду `docker-compose up` в корне проекта, предварительно указав необходимые `ENV` переменные.
