import style from './Preloader.module.scss';

export const Preloader = () => {
    return (
        <div className={style.preloaderWrapper} role="status">
            <div className={style.ldsRipple}>
                <div></div>
                <div></div>
            </div>
            <span className="visually-hidden">Загрузка...</span>
        </div>
    );
};
