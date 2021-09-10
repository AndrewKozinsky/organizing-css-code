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