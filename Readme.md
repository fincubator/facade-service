# FACADE-SERVICE
  
**FACADE-SERVICE** является микросервисом роутинга запросов между фронтендом и микросервисами [golos.io](https://golos.io).
Для работы сервису необходим совместимый фронтенд-гейт, осуществляющий конечное общение с фронтендом и авторизацию входящих запросов.

##### API JSON-RPC
Общий формат всех входящих запросов из гейта должен строго соответствовать этому формату:

*(для внутренних запросов формат может быть любой, смотри также transfer в секции про внутренние запросы)*

```
 user <string>              // Имя пользователя, определенное гейтом
                            // может отсутствовать для анонимных запросов
 
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
             
     
 getOptions:               // Запрос на получение настрек пользователя
                           // Автоматически создает дефолтные настройки при первом запросе
     user <string>         // Имя пользователя
     params:               // Параметры запроса из гейта
         profile <string>  // Идентификатор профиля пользователя
     
 setOptions:               // Запрос на установку настроек пользователя
     user <string>         // Имя пользователя
     params:               // Параметры запроса из гейта
         profile <string>  // Идентификатор профиля пользователя
         basic <Object>    // Объект базовых настроек, на данный момент не стандартизирован 
         notify <Object>   // Объект настроек онлайн уведомлений
         push <Object>     // Объект настроек push-нотификаций
     
 onlineNotifyOn:                // Подписывает на онлайн оповещения для пользователя
     user <string>              // Имя пользователя
     channelId <string>         // Идентификатор канала передачи данных
     requestId <number|string>  // Идентификатор запроса в виде порядкового числа или уникальной строки
     
 onlineNotifyOff:               // Отписывает от онлайн оповещений для пользователя
     user <string>              // Имя пользователя
     channelId <string>         // Идентификатор канала передачи данных
     
 onlineNotify. // --- Ветка работы с онлайн нотификациями ---        
     
 onlineNotify.history:                  // Получение истории нотификаций с учетом настроек пользователя
     user <string>                      // Имя пользователя
     params:                            // Параметры запроса из гейта
         fromId <string|null>(null)     // ID с которого нужно начать показывать историю, опционально
         limit <number>(10)             // Необходимое количество строк истории
         markAsViewed <boolean>(true)   // Пометить ли все выгруженные записи как прочитанные
         freshOnly <boolean>(false)     // Возвратить только непрочитанные данные
                                  
 onlineNotify.historyFresh:  // Получение количества непрочитанных нотификаций с учетом настроек пользователя
     user <string>           // Имя пользователя
  
 push. // --- Ветка работы с пушами ---     
     
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
     
 getNotifyHistory:                      // Получение истории нотификаций
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
     
 getNotifyHistoryFresh:      // Получение количества непрочитанных нотификаций
     user <string>           // Имя пользователя
                         
 notify. // --- Ветка работы с нотификациями ---                      
                         
 notify.markAsViewed:         // Пометить указанные нотификации как прочитанные
     user <string>            // Имя пользователя
     params:                  // Параметры запроса из гейта
         ids <string[]>       // Список идентификаторов для пометки
     
 notify.markAllAsViewed:      // Пометить все нотификации как прочитанные
     user <string>            // Имя пользователя
     
 notify.getBlackList:         // Возвращает черный список пользователя
      <empty>                 // Без параметров
      
 notify.addToBlackList:       // Добавляет пользователя в черный список
      banned <string>         // Имя пользователя для добавления
  
 notify.removeFromBlackList:  // Исключает пользователя из черного списка                   
      banned <string>         // Имя пользователя для исключения    
     
 getFavorites:                // Получить избранные посты пользователя
     user <string>            // Имя пользователя
     
 addFavorite:                 // Добавить пост в избранные
     user <string>            // Имя пользователя
     params:                  // Параметры запроса из гейта
         permlink <string>    // Пермлинк поста
     
 removeFavorite:              // Удалить пост из избранных
     user <string>            // Имя пользователя
     params:                  // Параметры запроса из гейта
         permlink <string>    // Пермлинк поста
         
 content. // --- Ветка работы с контентом ---
 
 content.getNaturalFeed:         // Получение ленты постов в натуральном виде без ранжирования
     params:                     // Параметры запроса из гейта
         tags <string[]>([])     // Теги для фильтрации
         afterId <string>(null)  // ID с которого нужно начать показывать историю
         limit <number>(20)      // Необходимое количество постов
         
 content.getPopularFeed:         // Получение ленты постов с ранжированием "Популярное"
     params:                     // Параметры запроса из гейта
         tags <string[]>([])     // Теги для фильтрации
         afterId <string>(null)  // ID с которого нужно начать показывать историю
         limit <number>(20)      // Необходимое количество постов
     
 content.getActualFeed:          // Получение ленты постов с ранжированием "Актуальное"
     params:                     // Параметры запроса из гейта
         tags <string[]>([])     // Теги для фильтрации
         afterId <string>(null)  // ID с которого нужно начать показывать историю
         limit <number>(20)      // Необходимое количество постов
              
 content.getPromoFeed:           // Получение ленты постов с ранжированием "Промо"
     params:                     // Параметры запроса из гейта
         tags <string[]>([])     // Теги для фильтрации
         afterId <string>(null)  // ID с которого нужно начать показывать историю
         limit <number>(20)      // Необходимое количество постов  
                           
 content.getPersonalFeed:        // Получение ленты постов на основе подписок пользователя
     user <string>               // Имя пользователя
     params:                     // Параметры запроса из гейта  
         tags <string[]>([])     // Теги для фильтрации
         afterId <string>(null)  // ID с которого нужно начать показывать историю
         limit <number>(20)      // Необходимое количество постов 
```

Апи, доступное без авторизации:

```
 registration. // --- Ветка работы с регистрацией ---    
     
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
 
 rates. // --- Ветка работы с курсами обмена ---
        
 rates.getActual:             // Получить актуальные курсы обмена
      <empty>                 // Без параметров
 
 rates.getHistorical:         // Получить историю курсов обмена
     params:                  // Параметры запроса из гейта
         date <timestamp>     // Необходимая дата
                   
 rates.getHistoricalMulti:    // Получить историю курсов обмена для нескольких дат
     params:                  // Параметры запроса из гейта
         dates <timestamp[]>  // Массив необходимых дат

 meta. // --- Ветка работы с мета данными ---

 meta.recordPostView             // Запись факта просмотра поста
     postLink <string>           // Полная ссылка на пост author/perm-link
     fingerPrint <string>        // Finger print браузера

 meta.getPostsViewCount          // Получить количество просмотров для постов
     postLinks <string[]>        // Список ссылок на посты в формате author/perm-link
```

Апи для обращения из внутренних микросервисов:

```
 transfer:                     // Переправить данные пользователю в виде JSON-RPC нотификации
     channelId <string>        // Идентификатор канала передачи данных
     method <string>           // Имя RPC метода
     error <Object|null>       // Объект ошибки (нет если есть result)
     result <Object|null>      // Объект данных (нет если есть error)
     _frontendGate? <boolean>  // Флаг того что запрос был отправлен из гейта
                               // В случае true - запрос будет заблокирован
```

### Переменные окружения

Возможные переменные окружения `ENV`:

  - `GLS_FRONTEND_GATE_CONNECT` *(обязательно)* - адрес подключения к микросервису фронтенд-гейту.

  - `GLS_ONLINE_NOTIFY_CONNECT` *(обязательно)* - адрес подключения к микросервису онлайн нотификаций.

  - `GLS_NOTIFY_CONNECT` *(обязательно)* - адрес подключения к микросервису регистрации нотификаций.

  - `GLS_OPTIONS_CONNECT` *(обязательно)* - адрес подключения к микросервису настроек.

  - `GLS_PUSH_CONNECT` *(обязательно)* - адрес подключения к микросервису рассылки push-уведомлений.

  - `GLS_MAIL_CONNECT` *(обязательно)* - адрес подключения к микросервису рассылки писем.
  
  - `GLS_REGISTRATION_CONNECT` *(обязательно)* - адрес подключения к микросервису регистрации пользователей.

  - `GLS_RATES_CONNECT` *(обязательно)* - адрес подключения к микросервису хранящему курсы валют.
  
  - `GLS_PRISM_CONNECT` *(обязательно)* - адрес подключения к микросервису призма.

  - `GLS_META_CONNECT` *(обязательно)* - адрес подключения к микросервису мета данных.

  - `GLS_CONNECTOR_HOST` *(обязательно)* - адрес, который будет использован для входящих подключений связи микросервисов.  
   Дефолтное значение при запуске без докера - `127.0.0.1`
    
  - `GLS_CONNECTOR_PORT` *(обязательно)* - адрес порта, который будет использован для входящих подключений связи микросервисов.  
   Дефолтное значение при запуске без докера - `8080`, пересекается с `GLS_FRONTEND_GATE_PORT`
    
  - `GLS_METRICS_HOST` *(обязательно)* - адрес хоста для метрик StatsD.  
   Дефолтное значение при запуске без докера - `127.0.0.1`
          
  - `GLS_METRICS_PORT` *(обязательно)* - адрес порта для метрик StatsD.  
   Дефолтное значение при запуске без докера - `8125`
    
  - `GLS_MONGO_CONNECT` - строка подключения к базе MongoDB.  
   Дефолтное значение - `mongodb://mongo/admin`
    
  - `GLS_DAY_START` - время начала нового дня в часах относительно UTC.
   Дефолтное значение - `3` (день начинается в 00:00 по Москве).
   
### Запуск

Для запуска достаточно вызвать команду `docker-compose up` в корне проекта, предварительно указав необходимые `ENV` переменные.    
