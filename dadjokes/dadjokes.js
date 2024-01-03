{
    const $ = document.querySelector.bind(document),
        $$ = document.querySelectorAll.bind(document);

    const pubSub = (function pubSub() {
        const subs = {};

        function publish(evt, data) {
            if (!Array.isArray(subs[evt])) {
                return;
            }
            subs[evt].forEach(method => method(data));
        }

        function subscribe(evt, method) {
            subs[evt] = Array.isArray(subs[evt]) ? subs[evt] : [];
            subs[evt].push(method);
        }

        return {
            publish,
            subscribe,
        };
    }());

    let hash = document.location.hash.slice(1);

    const dadsUrl = 'https://icanhazdadjoke.com',
        buttons = {
            random: $('button.random'),
            copyJoke: $('#one-joke .copy-text'),
            returnToHome: $('.return-to-main'),
        },
        getJokeList = () => getDadJokes(query.value).then(response => {
            fillList(response.data.results);
            pubSub.publish('pagechange', response.data);
        }),
        jokeForm = $('#joke-form'),
        jokesList = $('#joke-list'),
        notFound = $('.not-found'),
        oneJoke = $('#one-joke'),
        pagerElm = $('#pager'),
        query = $('input[name=query]');

    const getJokes = url => axios.get(url,{headers:{accept: 'application/json'}}),
        getDadJokes = text => getJokes(text ? `${dadsUrl}/search?term=${text}&limit=10&page=${pager.currentPage}`: dadsUrl),
        getOneDadJoke = jokeId => getJokes(`${dadsUrl}/j/${jokeId}`);

    function setupPagination() {
        const pager = {
            currentPage: 1,
            maxPage: 1,
            handler: (data) => {
                const INACTIVE = 'inactive';
                const first = $('#pager .first'),
                    last = $('#pager .last'),
                    currentPg = $('#pager .current .page-number'),
                    totalPgs = $('#pager .current .page-total'),
                    prev = $('#pager .prev'),
                    next = $('#pager .next'),
                    {current_page: current,total_pages: max,total_jokes: count} = data;

                pager.currentPage = current;
                pager.maxPage = max;
                first.classList.toggle(INACTIVE,count < 1 || current < 2);
                last.classList.toggle(INACTIVE,count < 1 || current >= data.total_pages);
                next.classList.toggle(INACTIVE,current >= data.total_pages);
                prev.classList.toggle(INACTIVE,current < 2);
                currentPg.textContent = ` ${current} `;
                totalPgs.textContent = ` ${max} `;
                pagerElm.classList.toggle('hide',count < 1);
            },

            next: () => {
                pager.currentPage++;
                getJokeList();
            },
            prev: () => {
                pager.currentPage--;
                getJokeList();
            },
            first: () => {
                pager.currentPage = 1;
                getJokeList();
            },
            last: () => {
                pager.currentPage = pager.maxPage;
                getJokeList();
            },
        };
        pubSub.subscribe('pagechange',pager.handler.bind(pager));
        return pager;
    }

    function hide(selector) {
        const elm = typeof selector === 'string' ? $(selector) : selector;
        elm.classList.add('hide');
    }
    function show(selector) {
        const elm = typeof selector === 'string' ? $(selector) : selector;
        elm.classList.remove('hide');
    }

    function fillList(jokes) {
        const jokeText = text => text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt');
        let list = '';
        if (!jokes || jokes.length < 1) {
            show(notFound);
            hide(jokesList);
        } else {
            list = jokes.map(joke => (`<li data-joke-id="${joke.id}" class="joke"><a href="#" data-joke-id="${joke.id}">${jokeText(joke.joke)}</a></li>`)).join('');
            hide(notFound);
            show(jokesList);
        }
        jokesList.innerHTML = list;
    }
    function searchByText(e) {
        hide(notFound);
        pager.first();
    }
    function getRandomJoke(e) {
        hide(notFound);
        getDadJokes().then(response => fillList([response.data]));
    }
    function showOneJoke(e) {
        const jokeId = e.target.dataset.jokeId;
        document.location.href = `#id=${jokeId}`;
        e.preventDefault();
    }
    function oneJokeText(newText) {
        const oneJokeElm = $('#one-joke .the-joke');
        if (typeof newText === 'string') {
            oneJokeElm.innerText = newText;
        }
        return oneJokeElm.innerText;
    }
    function copyJokeText() {
        const jokeText = oneJokeText();
        navigator.clipboard.writeText(jokeText);
        oneJoke.classList.add('show');
        setTimeout(() => oneJoke.classList.remove('show'),5000);
    }

    function changePage() {
        const showMainPage = () => {
                hide(oneJoke);
                jokesList.innerHTML = '';
                pubSub.publish('pagechange', {total_jokes: 0});
                show(jokeForm);
            },
            showOneJokePage = () => {
                const jokeId = decodeURIComponent(hash.replace(/^id=/,''));
                hide(jokeForm);
                getOneDadJoke(jokeId).then(response => {
                    oneJokeText(response.data.joke);
                    show(oneJoke);
                });
            }

        hash = document.location.hash.slice(1);

        if (!hash) {
            showMainPage();
        } else {
            showOneJokePage();
        }
    }

    buttons.random.addEventListener('click',getRandomJoke);
    buttons.returnToHome.addEventListener('click',() => (hash = document.location.hash = ''));
    buttons.copyJoke.addEventListener('click',copyJokeText);

    query.addEventListener('input',searchByText);

    pagerElm.addEventListener('click',(e) => {
        if (e.target.nodeName === 'LI') {
            method = e.target.className;
            pager[method]();
        }
    });

    jokesList.addEventListener('click',showOneJoke);
    window.addEventListener('hashchange',changePage);
    let pager = setupPagination();
    changePage();
}
