import { PartSearch } from './Components/features/PartSearch/PartSearch';
import { Analogues } from './Components/features/Analogues/Analogues';

function App() {
    return (
        <main className="container py-4">
            <h1 className="h3 mb-4">Поиск автозапчастей и аналогов</h1>

            {/* Слева поиск и производители, справа аналоги выбранного производителя.
                На экранах уже lg колонки встают друг под друга */}
            <div className="row g-4">
                <div className="col-lg-4">
                    <PartSearch />
                </div>
                <div className="col-lg-8">
                    <Analogues />
                </div>
            </div>
        </main>
    );
}

export default App;
