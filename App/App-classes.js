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