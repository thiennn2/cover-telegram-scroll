import './App.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const PAGE_SIZE = 10;

function getRenderPages(page) {
  if (page < 3) {
    return [1, 2, 3];
  }
  return [page - 1, page, page + 1];
}

function App() {
  const scrollRef = useRef(null);
  const [page, setPage] = useState(1);
  const [todos, setTodos] = useState([]);
  const [renderTodos, setRenderTodos] = useState([]);
  const [id, setId] = useState(null);
  const [initialPage, setInitialPage] = useState(null);
  
  useLayoutEffect(() => {
    const scroller = scrollRef.current;
    const el = id ? document.getElementById(id) : null;
    console.log("scrollIntoView", el);
    if (el && scroller) {
      el.scrollIntoView({ behavior: 'smooth' });
      setId(null);
      setInitialPage(null);
    }
  });

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    console.log("scroll.addEventListener");
    scroll.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = scroll;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      const isNearTop = scrollTop < 100 && scrollTop > 1;
      if (isNearTop && page !== 1) {
        const pages = getRenderPages(page);
        const nextPage = pages[0];
        if (nextPage < 1) return;
        console.log("pages--nextPage--", pages, nextPage);
        return setPage(nextPage);
      }
      if (isNearBottom) {
        const pages = getRenderPages(page);
        const prevPage = pages[pages.length - 1];
        if (prevPage > 19) return;
        console.log("pages--prevPage--", pages, prevPage);
        return setPage(prevPage);
      }
      if (scrollTop === 0 && page > 1) {
        // don't now why but it's not working
        console.log(`scrollTop(${scrollTop}) === 0 && page(${page}) > 1`);
        scroll.scrollTop = 100;
      }
    });
    return () => {
      console.log("scroll.removeEventListener");
      scroll.removeEventListener('scroll', () => {
      });
    }
  }, [page])

  useEffect(() => {
    if (page > 1 && page < 20) {
      const pages = getRenderPages(page);
      console.log(`getRenderPages(${page})`, pages);
      // from todos to renderTodos
      const newTodos = [];
      pages.forEach((_page) => {
        newTodos.push(...todos.slice((_page - 1) * PAGE_SIZE, _page * PAGE_SIZE));
      })
      setRenderTodos(newTodos);
    }
  }, [page, todos]);

  useEffect(() => {
    if (initialPage > 0 && initialPage < 20) {
      setPage(initialPage);
    }
  }, [initialPage]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos").then(response => response.json()).then(data => {
      setTodos(data);
      setRenderTodos(data.slice(0, 3 * PAGE_SIZE));
    });
  }, [])

  function handleScroll(id) {
    // const _page = 3;
    // const pages = getRenderPages(_page);
    // const newTodos = [];
    // pages.forEach((_page) => {
    //   newTodos.push(...todos.slice((_page - 1) * PAGE_SIZE, _page * PAGE_SIZE));
    // });
    // setRenderTodos(newTodos);
    setInitialPage(4);
    setId(id);
  }

  return (
    <div className="App">
      <div ref={scrollRef} className='scrollable' style={{ height: 500, overflow: "auto", display: 'flex', flexDirection: "column" }}>
        {renderTodos.map(todo => {
          return (
            <div id={todo.id} key={todo.id}>
              <h1>{todo.id} {todo.title}</h1>
              <p>{todo.completed}</p>
              {todo.id === 95 ? (
                <button onClick={() => handleScroll(35)}>Scroll To 35</button>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
