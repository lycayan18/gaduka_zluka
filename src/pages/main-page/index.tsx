import React from "react";
import "./styles.scss"

export default function MainPage() {
    return (
        <div className="main-page-content">
            <h1>Приветствуем на GadukaZluka.io!</h1>
            <p>
                <b>GadukaZluka.io</b> - это чат-приложение, где люди общаются в чатах в реальном времени.
            </p>
            <p>
                Чаты разделены на ветки, каждая из которых добавляет новую особенность чату.
            </p>
            <p>
                Например:
            </p>
            <ul>
                <li>/anon - в данном чате люди общаются анонимно друг с другом. В этом чате можно придумать себе любой ник.</li>
                <li>/auth - в данном чате люди общаются под своими зарегестрированными аккаунтами.</li>
                <li>/*/rand - в данном чате вам выбирается случайный собеседник, с которым вы будете общаться на протяжении времени.</li>
            </ul>
            <br/>
            <h4>Выбирайте себе любой чат и общайтесь!</h4>

            <div className="authors">
                <span>Авторы проекта:</span>
                <div className="author">
                    <div className="author-nickname">DungyBug</div>
                    <ul className="account-links">
                        <li>
                            <img src="https://telegram.org/img/website_icon.svg" width="20" alt="" />
                            <a href="https://t.me/dungybug" target="_blank">@dungybug</a>
                        </li>
                        <li>
                            <img src="https://github.githubassets.com/favicons/favicon.svg" width="20" alt="" />
                            <a href="https://github.com/DungyBug" target="_blank">DungyBug</a>
                        </li>
                    </ul>
                </div>
                <div className="author">
                    <div className="author-nickname">drakutont</div>
                    <ul className="account-links">
                        <li>
                            <img src="https://telegram.org/img/website_icon.svg" width="20" alt="" />
                            <a href="https://t.me/drakutont" target="_blank">@drakutont</a>
                        </li>
                        <li>
                            <img src="https://github.githubassets.com/favicons/favicon.svg" width="20" alt="" />
                            <a href="https://github.com/DRAKUTONT" target="_blank">DRAKUTONT</a>
                        </li>
                    </ul>
                </div>
                <div className="author">
                    <div className="author-nickname">Kirill</div>
                    <ul className="account-links">
                        <li>
                            <img src="https://telegram.org/img/website_icon.svg" width="20" alt="" />
                            <a href="https://t.me/zaboluev" target="_blank">@zaboluev</a>
                        </li>
                        <li>
                            <img src="https://github.githubassets.com/favicons/favicon.svg" width="20" alt="" />
                            <a href="https://github.com/ZaboluevK" target="_blank">ZaboluevK</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}