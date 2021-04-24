import './Component.css';
import { Link } from 'react-router-dom';

const Home = (): JSX.Element => {
    return(
        <div className="home">
            <div className="hero">
                <h1>Welcome to MineSweeper</h1>
                <Link to="/board" className="start-btn">Start Game</Link>
            </div>
        </div>
    )
}

export default Home;