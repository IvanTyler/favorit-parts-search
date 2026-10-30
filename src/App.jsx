import { PartSearch } from './Components/features/PartSearch/PartSearch';
import { Analogues } from './Components/features/Analogues/Analogues';

function App() {
    return (
        <main className="container py-4">
            <header className="mb-4">
                <h1 className="h3 mb-1">Поиск автозапчастей и аналогов</h1>
                <p className="text-secondary mb-0">
                    Введите артикул, выберите производителя — покажем цены, наличие и аналоги
                </p>
            </header>

            {/* Слева поиск и производители, справа аналоги выбранного производителя.
                На экранах уже lg колонки встают друг под друга */}
            <div className="row g-4 align-items-start">
                <div className="col-lg-4">
                    <div className="panel">
                        <PartSearch />
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="panel">
                        <Analogues />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default App;
