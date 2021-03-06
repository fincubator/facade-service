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

_frontendGate <boolean>        // Флаг того что запрос был отправлен из фронтенд-гейта,
                               // необходим для автоматической фильтрации внешних запросов,
                               // которые не допустимы для внутренних методов

params <Object>                // Входящие параметры запроса, те самые параметры что попадают
                               // в фронтенд-гейт как входящий запрос, всё остальное выше
                               // определяется автоматически на уровне гейта
```

Детальное описание:

```
offline                   // Оповещает все заинтересованные сервисы о том что пользователь офлайн
    user <string>         // Имя пользователя
    channelId <string>    // Идентификатор канала передачи данных


options.get                    // Запрос на получение настрек пользователя
                               // Автоматически создает дефолтные настройки при первом запросе
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        profile <string>       // Идентификатор профиля пользователя
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

options.set                    // Запрос на установку настроек пользователя
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        profile <string>       // Идентификатор профиля пользователя
        basic <Object>         // Объект базовых настроек, на данный момент не стандартизирован
        notify <Object>        // Объект настроек онлайн уведомлений
        push <Object>          // Объект настроек push-нотификаций
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

onlineNotify.on                // Подписывает на онлайн оповещения для пользователя
    user <string>              // Имя пользователя
    channelId <string>         // Идентификатор канала передачи данных
    requestId <number|string>  // Идентификатор запроса в виде порядкового числа или уникальной строки
    params:                    // Параметры запроса из гейта
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

onlineNotify.off               // Отписывает от онлайн оповещений для пользователя
    user <string>              // Имя пользователя
    channelId <string>         // Идентификатор канала передачи данных
    params:                    // Параметры запроса из гейта
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

onlineNotify.history                   // Получение истории нотификаций с учетом настроек пользователя
    user <string>                      // Имя пользователя
    params:                            // Параметры запроса из гейта
        fromId <string|null>(null)     // ID с которого нужно начать показывать историю, опционально
        limit <number>(10)             // Необходимое количество строк истории
        markAsViewed <boolean>(true)   // Пометить ли все выгруженные записи как прочитанные
        freshOnly <boolean>(false)     // Возвратить только непрочитанные данные
        app <string>('cyber')          // Тип приложения / домена
            [
              cyber                    // CyberWay
            | gls                      // Golos
            ]

onlineNotify.historyFresh      // Получение количества непрочитанных нотификаций с учетом настроек пользователя
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

push.notifyOn                  // Подписывает на push-оповещения для пользователя по профилю
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        key <string>           // Ключ рассылки нотификации
        profile <string>       // Идентификатор профиля пользователя
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

push.notifyOff                 // Отписывает от push-оповещений для пользователя по профилю
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        key <string>           // Ключ рассылки нотификации
        profile <string>       // Идентификатор профиля пользователя
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

push.history                               // Получение истории нотификаций с учетом настроек пользователя
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
            | witnessVote                  // голос за делегата
            | witnessCancelVote            // отмена голоса за делегата
            ]
        app <string>('cyber')              // Тип приложения / домена
            [
              cyber                        // CyberWay
            | gls                          // Golos
            ]

push.historyFresh                      // Получение количества непрочитанных нотификаций с учетом настроек пользователя
    user <string>                      // Имя пользователя
    params:                            // Параметры запроса из гейта
        profile <profile>              // Профиль пользователя
        app <string>('cyber')          // Тип приложения / домена
            [
              cyber                    // CyberWay
            | gls                      // Golos
            ]

notify.getHistory                      // Получение истории нотификаций
    user <string>                      // Имя пользователя
    params:                            // Параметры запроса из гейта
        fromId <string|null>(null)     // ID с которого нужно начать показывать историю, опционально
        limit <number>(10)             // Необходимое количество строк истории
        markAsViewed <boolean>(true)   // Пометить ли все выгруженные записи как прочитанные
        freshOnly <boolean>(false)     // Возвратить только непрочитанные данные
        types <'all'|string[]>('all')  // Массив необходимых типов нотификаций или 'all' если нужны все
            [
              vote                     // лайк (голос)
            | flag                     // флаг (дизлайк, жалоба)
            | transfer                 // перевод средств
            | reply                    // ответ на пост или комментарий
            | subscribe                // подписка на блог
            | unsubscribe              // отписка от блога
            | mention                  // упоминание в посте, заголовке поста или в комменте (через @)
            | repost                   // репост
            | reward                   // награда пользователю
            | curatorReward            // награда куратору
            | witnessVote              // голос за делегата
            | witnessCancelVote        // отмена голоса за делегата
            ]
        app <string>('cyber')          // Тип приложения / домена
            [
              cyber                    // CyberWay
            | gls                      // Golos
            ]

notify.getHistoryFresh         // Получение количества непрочитанных нотификаций
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

notify.markAsViewed            // Пометить указанные нотификации как не новые (`fresh: false`)
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        ids <string[]>         // Список идентификаторов для пометки
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

notify.markAllAsViewed         // Пометить все нотификации как не новые (`fresh: false`)
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

notify.markAsRead              // Пометить указанные нотификации как прочитанные (`unread: false`)
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        ids <string[]>         // Список идентификаторов для пометки
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

notify.markAllAsRead           // Пометить все нотификации как прочитанные (`unread: false`)
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

notify.getBlackList            // Возвращает черный список пользователя
    params:                    // Параметры запроса из гейта
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

notify.addToBlackList           // Добавляет пользователя в черный список
     params:                    // Параметры запроса из гейта
         banned <string>        // Имя пользователя для добавления
         app <string>('cyber')  // Тип приложения / домена
             [
               cyber            // CyberWay
             | gls              // Golos
             ]

notify.removeFromBlackList      // Исключает пользователя из черного списка
     params:                    // Параметры запроса из гейта
         banned <string>        // Имя пользователя для исключения
         app <string>('cyber')  // Тип приложения / домена
             [
               cyber            // CyberWay
             | gls              // Golos
             ]

favorites.get                  // Получить избранные посты пользователя
    params:                    // Параметры запроса из гейта
        user <string>          // Имя пользователя
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

favorites.add                  // Добавить пост в избранные
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        permlink <string>      // Пермлинк поста
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

favorites.remove               // Удалить пост из избранных
    user <string>              // Имя пользователя
    params:                    // Параметры запроса из гейта
        permlink <string>      // Пермлинк поста
        app <string>('cyber')  // Тип приложения / домена
            [
              cyber            // CyberWay
            | gls              // Golos
            ]

meta.markUserOnline          // Пометить юзера как онлайн
    <empty>                  // Без параметров
```

Апи, доступное без авторизации:

```
frame.getEmbed              // Сделать запрос к iframely
    params:                 // Параметры запроса из гейта
        type                // Тип (oembed либо iframely)
        url                 // Ссылка на ресурс

registration.getState       // Получить текущее состояние регистрации
    params:                 // Параметры запроса из гейта
        user                // Имя пользователя

registration.firstStep      // Сделать первый шаг регистрации
    params:                 // Параметры запроса из гейта
        captcha? <string>   // Верификационный код капчи (если не отключена)
        user <string>       // Имя пользователя
        phone <string>      // Телефон пользователя
        mail <string>       // Почта пользователя

registration.verify         // Сделать верификацию регистрации (кроме стратегии smsFromUser)
    params:                 // Параметры запроса из гейта
        user <sting>        // Имя пользователя
        code? <string>      // Код из смс (стратегия smsToUser)

registration.toBlockChain   // Зарегистрировать пользователя в блокчейн
    params:                 // Параметры запроса из гейта
        user <string>       // Имя пользователя
        owner <string>      // Ключ владельца
        active <string>     // Активный ключ
        posting <string>    // Постинг ключ
        memo <string>       // Мемо ключ (ключ заметок)

registration.changePhone    // Сменить номер телефона (стратегия smsFromUser, smsToUser)
    params:                 // Параметры запроса из гейта
        user <string>       // Имя пользователя
        phone <string>      // Телефон пользователя
        captcha? <string>   // Верификационный код капчи (если не отключена)

registration.resendSmsCode       // Переотправить код на телефон пользователя (стратегия smsToUser)
    params:                      // Параметры запроса из гейта
        user <string>            // Имя пользователя
        phone <string>           // Телефон пользователя

registration.subscribeOnSmsGet   // Подписаться на получение смс от пользователя (стратегия smsFromUser)
    channelId <string>           // Идентификатор канала передачи данных
    params:                      // Параметры запроса из гейта
        user <string>            // Имя пользователя
        phone <string>           // Телефон пользователя

rates.getActual                 // Получить актуальные курсы обмена
     <empty>                     // Без параметров

rates.getHistorical              // Получить историю курсов обмена
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

meta.getUserLastOnline           // Получить время (timestamp) последного онлайна пользователей
    params:                      // Параметры запроса из гейта
        user <string>            // Имя пользователя

content.getProfile                   // Получение профиля пользователя
    params:                          // Параметры запроса из гейта
        userId <string>              // Идентификатор пользователя
        username <string>            // Имя пользователя относительно домена
        app <string>('cyber')        // Тип приложения / домена
            [
              cyber                  // CyberWay
            | gls                    // Golos
            ]

content.getChargers                  // Получение батареек пользователя
    params:                          // Параметры запроса из гейта
        userId <string>              // Идентификатор пользователя

content.getPost                      // Получение конкретного поста
    params:                          // Параметры запроса из гейта
        userId <string>              // Идентификатор пользователя
        username <string>            // Имя пользователя относительно домена
        app <string>('cyber')        // Тип приложения / домена
            [
              cyber                  // CyberWay
            | gls                    // Golos
            ]
        permlink <string>            // Пермлинк поста
        refBlockNum <number>         // Привязанный блок поста
        contentType <string>('web')  // Определить тип получаемого контента
            [
              web                    // Контент, пригодный для веб-клиентов
            | mobile                 // Контент, пригодный для мобильных устройств
            | raw                    // Сырой контент без обработки
            ]

content.getComment                   // Получение конкретного коммента
    params:                          // Параметры запроса из гейта
        userId <string>              // Идентификатор пользователя
        username <string>            // Имя пользователя относительно домена
        app <string>('cyber')        // Тип приложения / домена
            [
              cyber                  // CyberWay
            | gls                    // Golos
            ]
        permlink <string>            // Пермлинк поста
        refBlockNum <number>         // Привязанный блок поста
        contentType <string>('web')  // Определить тип получаемого контента
            [
              web                    // Контент, пригодный для веб-клиентов
            | mobile                 // Контент, пригодный для мобильных устройств
            | raw                    // Сырой контент без обработки
            ]

content.getFeed                      // Получение ленты постов
    params:                          // Параметры запроса из гейта
        type <string>('community')   // Тип ленты
            [
              community              // Лента комьюнити, требует communityId
            | subscriptions          // Лента подписок пользователя, требует userId
            | byUser                 // Лента постов самого пользователя, требует userId
            ]
        sortBy <string>('time')      // Способ сортировки
            [
              time                   // Сначала старые, потом новые
            | timeDesc               // Сначала новые, потом старые
            | popular                // По популярности (только для community)
            ]
        timeframe <string>('day')    // Область выборки сортировки (только для community + popular)
            [
              day                    // За день
            | week                   // За неделю
            | month                  // За месяц
            | year                   // За год
            | all                    // За всё время
            | WilsonHot              // Aлгоритм Вилсона, актуальный контент сейчас
            | WilsonTrending         // Aлгоритм Вилсона, в целом популярный контент
            ]
        sequenceKey <string/null>    // Идентификатор пагинации для получения следующего контента
        limit <number>               // Количество элементов
        userId <string/null>         // Идентификатор пользователя
        communityId <string>         // Идентификатор комьюнити
        tags <string[]/null>         // Теги для фильтрации (только для community и сортировкой по времени)
        contentType <string>('web')  // Определить тип получаемого контента
            [
              web                    // Контент, пригодный для веб-клиентов
            | mobile                 // Контент, пригодный для мобильных устройств
            | raw                    // Сырой контент без обработки
            ]
        username <string>            // Имя пользователя относительно домена
        app <string>('cyber')        // Тип приложения / домена
            [
              cyber                  // CyberWay
            | gls                    // Golos
            ]

content.getComments                  // Получение ленты комментариев
    params:                          // Параметры запроса из гейта
        sortBy <string>('time')      // Способ сортировки
            [
              time                   // Сначала старые, потом новые
            | timeDesc               // Сначала новые, потом старые
            ]
        sequenceKey <string/null>    // Идентификатор пагинации для получения следующего контента
        limit <number>(10)           // Количество элементов
        type <string>('post')        // Тип ленты
            [
              post                   // Получить комментарии для поста, требует userId, permlink, refBlockNum
            | user                   // Получить комментарии пользователя, требует userId
            | replies                // Получить комментарии, которые были оставлены пользователю, требует userId
            ]
        userId <string/null>         // Идентификатор пользователя
        permlink <string/null>       // Пермлинк поста
        refBlockNum <number/null>    // Привязанный блок поста
        contentType <string>('web')  // Определить тип получаемого контента
            [
              web                    // Контент, пригодный для веб-клиентов
            | mobile                 // Контент, пригодный для мобильных устройств
            | raw                    // Сырой контент без обработки
            ]
        username <string>            // Имя пользователя относительно домена
        app <string>('cyber')        // Тип приложения / домена
            [
              cyber                  // CyberWay
            | gls                    // Golos
            ]

content.getHashTagTop                // Получение топа хеш-тегов
    params:                          // Параметры запроса из гейта
        communityId <string>         // Идентификатор комьюнити
        limit <number>(10)           // Количество элементов
        sequenceKey <string/null>    // Идентификатор пагинации для получения следующего контента

content.getLeadersTop                // Получить топ лидеров
    auth:                            // Авторизационные данные
        user <string>                // Имя пользователя
    params:                          // Параметры запроса из гейта
        communityId <string>         // Идентификатор комьюнити
        sequenceKey <string/null>    // Идентификатор пагинации для получения следующего контента
        limit <number>(10)           // Количество элементов
        app <string>('cyber')        // Тип приложения / домена
            [
              cyber                  // CyberWay
            | gls                    // Golos
            ]


content.waitForBlock                 // Дождаться и получить ответ когда призма обработает указанный блок
    params:                          // Параметры запроса из гейта
        blockNum <number>            // Номер блока

content.waitForTransaction           // Дождаться и получить ответ когда призма обработает указанную транзакцию
    params:                          // Параметры запроса из гейта
        transactionId <string>       // Идентификатор транзакции

content.getPostVotes                 // Получение списка голосов за пост
    sequenceKey <string/null>        // Идентификатор пагинации для получения следующего контента
    limit <number>(10)               // Количество элементов
    userId <string>                  // Идентификатор пользователя
    permlink <string>                // Пермлинк поста
    type <string>                    // Тип запрашиваемых голосов
         [
           like                      // Лайки
         | dislike                   // Дизлайка
         ]
    app <string>('cyber')            // Тип приложения / домена
        [
          cyber                      // CyberWay
        | gls                        // Golos
        ]

content.getCommentVotes              // Получение списка голосов за комментарий
    sequenceKey <string/null>        // Идентификатор пагинации для получения следующего контента
    limit <number>(10)               // Количество элементов
    userId <string>                  // Идентификатор пользователя
    permlink <string>                // Пермлинк комментария
    type <string>                    // Тип запрашиваемых голосов
         [
           like                      // Лайки
         | dislike                   // Дизлайка
         ]
    app <string>('cyber')            // Тип приложения / домена
        [
          cyber                      // CyberWay
        | gls                        // Golos
        ]

content.resolveProfile               // Резолв идентификатора пользователя и аватара по имени с доменом
    params:                          // Параметры запроса из гейта
        username <string>            // Имя пользователя относительно домена
        app <string>('cyber')        // Тип приложения / домена
            [
              cyber                  // CyberWay
            | gls                    // Golos
            ]

content.getSubscriptions             // Получить подписки пользователя
    params:                          // Параметры запроса из гейта
        userId <string>              // Идентификатор пользователя
        type <string>('user')        // Тип подписки
            [
              user                   // Подписки на пользователей
            | community              // Подписки на сообщества
            ]
        sequenceKey <string/null>    // Идентификатор пагинации для получения следующего контента
        limit <number>(10)           // Количество элементов

content.getSubscribers               // Получить подписчиков пользователя
    params:                          // Параметры запроса из гейта
        userId <string>              // Идентификатор пользователя
        type <string>('user')        // Тип подписки
            [
              user                   // Подписчики-пользователи
            | community              // Подписчики-сообщества
            ]
        sequenceKey <string/null>    // Идентификатор пагинации для получения следующего контента
        limit <number>(10)           // Количество элементов

content.getHeaders                   // Получить список заголовков для указанных постов
    params:                          // Параметры запроса из гейта
        contentIds <Array>           // Массив идентификаторов контента
            userId <string>          // Идентификатор пользователя
            permlink <string>        // Пермлинк поста
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

-   `GLS_PRISM_CONNECT` _(обязательно)_ - адрес подключения к микросервису призма (в режиме BLOCK).

-   `GLS_PRISM_API_CONNECT` - адрес подключения к микросервису призма (в режиме API), если не задан то берется значение из `GLS_PRISM_CONNECT`.

-   `GLS_META_CONNECT` _(обязательно)_ - адрес подключения к микросервису мета данных.

-   `GLS_BANDWIDTH_PROVIDER_CONNECT` _(обязательно)_ - адрес подключения к микросервису бэндвича.

-   `GLS_IFRAMELY_CONNECT` _(обязательно)_ - адрес подключения к микросервису Iframely.

-   `GLS_CONNECTOR_HOST` _(обязательно)_ - адрес, который будет использован для входящих подключений связи микросервисов.  
    Дефолтное значение при запуске без докера - `127.0.0.1`

-   `GLS_CONNECTOR_PORT` _(обязательно)_ - адрес порта, который будет использован для входящих подключений связи микросервисов.  
    Дефолтное значение при запуске без докера - `3000`, пересекается с `GLS_FRONTEND_GATE_PORT`

-   `GLS_METRICS_HOST` _(обязательно)_ - адрес хоста для метрик.  
    Дефолтное значение при запуске без докера - `0.0.0.0`

-   `GLS_METRICS_PORT` _(обязательно)_ - адрес порта для метрик.  
    Дефолтное значение при запуске без докера - `9777`

-   `GLS_MONGO_CONNECT` - строка подключения к базе MongoDB.  
    Дефолтное значение - `mongodb://mongo/admin`

-   `GLS_DAY_START` - время начала нового дня в часах относительно UTC.
    Дефолтное значение - `3` (день начинается в 00:00 по Москве).

### Запуск

Для запуска достаточно вызвать команду `docker-compose up` в корне проекта, предварительно указав необходимые `ENV` переменные.
