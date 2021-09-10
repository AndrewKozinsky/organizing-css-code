# Организация кода CSS в компонентах Реакта

Сейчас есть несколько способов внедрения CSS в разметку компонентов Реакта.
Рассмотрю их преимущества и недостатки.
А в конце расскажу своё предложение по огранизации CSS.

## Классический способ

Названия классов пишутся в тегах.
Это хорошо работает если точно известно какие классы будут использоваться в теге.
Но если классы будут различаться в зависимости от внешних данных (например переданных в компонент свойств), то придётся писать логику получения строки с классами.
А от логики в компонентах желательно избавляться чтобы придерживаться принципа одной ответственности: компонент должен работать только с разметкой.

    import './App.css'

    export default function App() {
        const config = { bg: 'red' }

        // Header classes
        const const headerCls = appRootClass + '__header'
        const headerClasses = [headerCls]

        if (config.bg) {
            headerClasses.push(`${headerCls}--${config.bg}`)
        }
    
        return (
            <div className='app'>
                <h1 className={headerClasses.join(' ')}>Header</h1>
            </div>
        )
    }

## Модули CSS

Такой способ создан прежде всего для «изоляции» стилей у компонента. Это достигается через добавление в название класса случайного набора символов.
Но по сути все недостатки классического способа остались — это код с логикой составления классов в компоненте.

    import style from './App.css'

    export default function App() {
        const config = { bg: 'red' }

        // Header classes
        const const headerCls = style.header
        const classes = [headerCls]

        if (config.bg) {
            classes.push(style.headerWithBg)
        }
    
        return (
            <div className={style.app}>
                <h1 className={headerCls.join(' ')}>Header</h1>
            </div>
        )
    }

## Стилевые компоненты

Если в предыдущих примерах была логика составления имён классов CSS, то сюда складывается весь CSS компонента.
В примере всего 4 правила и это не выглядит слишком громоздко. Но в реальном коде это количество увеличится в 10-20 раз и в компоненте будет больше CSS, чем разметки. 
    
    const styled = 'styled-components'

    const StyledRoot = `
        background-color: aquamarine;
    `

    const StyledHeader = `
        font-size: 20px;
        color: ${props => props.bg ? white : null};
        background-color: ${props => props.bg ? red : null};
    `

    export default function App() {
        const config = { bg: 'red' }
    
        return (
            <StyledRoot {...config}>
                <StyledHeader {...config}>
            </StyledDiv>
        )
    }

## Объект с классами

Это уже предлагаемый мной подход по организации классов.
Он заключается в том, что запускаемая функция makeClasses() отдаёт объект с ключами.
В значении строка с именами классов для конкретного элемента.
Там может быть как один класс, так и несколько. Это уже не важно.

В makeClasses() передаются любые данные влияющие на отображаемые классы.

#### App.js
    
    import makeClasses from "./App-classes"
    
    export default function App() {
        const config = { bg: 'red' }
    
        const CN = makeClasses(config)
    
        return (
            <div className={CN.root}>
                <h1 className={CN.header}>Header</h1>
            </div>
        )
    }

В отдельном файле описывается функция makeClasses() возвращающая объект.
В этом файле пишется логика составления классов.
А сам компонента уже получает готовые данные.

Хотя кода получается немного больше, но я считаю, что разные части программы отвечающие за различные аспекты лучше разносить по отдельным файлам.

Если вместо настоящих имён классов из App.css нужно импортировать объект с «изолированными» названиями, то вместо `import './App.css'` нужно написать `import styles from './App.css'` и использовать значения для формирования названия классов.

#### App-classes.js

    import './App.css'

    const appRootClass = 'app'
    
    function makeClasses(config) {
        return {
            root: appRootClass,
            header: getHeaderClass(config),
        }
    }
    
    function getHeaderClass(config) {
    const headerCls = appRootClass + '__header'
    const classes = [headerCls]
    
        if (config.bg) {
            classes.push(`${headerCls}--${config.bg}`)
        }
    
        return classes.join(' ')
    }
    
    export default makeClasses