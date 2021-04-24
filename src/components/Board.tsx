import React, { useEffect, useState } from 'react';
import random from 'random'
import './Component.css';

interface tileProperty {
    hidden: boolean,
    mine: 0|1,
    num: number,
    flagged: boolean,
    row: number,
    col: number
}

const Home = (): JSX.Element => {
    const mineNo = 15;
    const [firstMove, setFirstMove]= useState(true);
    const [board, setBoard] = useState([{ hidden: true, mine: 0, num: -1, flagged: false, row: 0, col: 0}]);
    const [flags, setFlags] = useState(mineNo);
    const [gameComplete, setGameComplete] = useState(false);
    const [finalText, setFinalText] = useState("Congratulation You have won the game.");

    useEffect(():void =>{
        boardInit();
    }, []);

    const boardInit = (): void => {
        var tempArr: Array<tileProperty> = [];
        for(var i=0; i<10; i++){
            for(var j=0; j<10; j++){
                var tileData:tileProperty = {
                    row: i,
                    col: j,
                    hidden: true,
                    mine: 0,
                    num: 0,
                    flagged: false
                };
                tempArr.push(tileData);
            }
        }
        setBoard(tempArr);
    }

    const revealTile = (row: number, col: number):void =>{
        if(firstMove === true){
            var skipTile: Array<number>= [];
            for(var i=-1; i<=1; i++){
                for(var j=-1; j<=1; j++){
                    if(row+i>=0 && row+i<10 && col+j>=0 && col+j<10){
                        skipTile.push((row+i)*10+j+col);
                    }
                }
            }
            var tempArr = [...board];
            for(var k=0; k<mineNo; k++){
                var pos:number = random.int(0, 99);
                var lop = true;
                while(lop){
                    if(tempArr[pos].mine === 0 && !skipTile.includes(pos)){
                        lop = false;
                        tempArr[pos].mine = 1;
                        var Row: number = tempArr[pos].row;
                        var Col: number = tempArr[pos].col;
                        tempArr.filter(tile => {
                            if(tile.row === Row-1 && tile.col === Col-1){
                                tile.num++;
                            }if(tile.row === Row-1 && tile.col === Col){
                                tile.num++;
                            }if(tile.row === Row-1 && tile.col === Col+1){
                                tile.num++;
                            }if(tile.row === Row+1 && tile.col === Col-1){
                                tile.num++;
                            }if(tile.row === Row+1 && tile.col === Col){
                                tile.num++;
                            }if(tile.row === Row+1 && tile.col === Col+1){
                                tile.num++;
                            }if(tile.row === Row && tile.col === Col-1){
                                tile.num++;
                            }if(tile.row === Row && tile.col === Col+1){
                                tile.num++;
                            }
                            return tile;
                        })
                    }else{
                        if(pos === 99){
                            pos = 0;
                        }else{
                            pos++;
                        }
                    }
                }
                
            }
            setFirstMove(false);
            console.log(skipTile);
        }
        revealNeighbourTile(row, col);
        checkStatus();
    }

    const revealNeighbourTile = (row: number, col: number):void => {
        if(row>=0 && row<10 && col>=0 && col<10){
            var tempBoard = [...board];
            var isZero = false;
            var isHidden = true;
            var isMine = false;
            tempBoard.filter(tile=>{
                if(tile.row === row && tile.col === col){
                    if(tile.mine === 1){
                        isMine = true;
                    }
                    if(tile.hidden === true){
                        tile.hidden = false;
                    }else{
                        isHidden = false;
                    }
                    if(tile.num === 0){
                        isZero = true;
                    }
                }
                return tile;
            });
            setBoard(tempBoard);
            if(isZero && isHidden && !isMine){
                for(var i=-1; i<=1; i++){
                    for(var j=-1; j<=1; j++){
                        if(i===0 && j===0){
                            
                        }else{
                            revealNeighbourTile(row+i, col+j);
                        }
                    }
                }
            } 
        }
    }

    const flagTile = (row: number, col: number):void =>{
        if(flags>0){
            toggleFlag(row,col);
            setFlags(prev=>prev-1);
        }
        
    }

    const unflagTile = (row: number, col: number):void =>{
        if(flags<=mineNo){
            toggleFlag(row,col);
            setFlags(prev=>prev+1);
        }
    }

    const toggleFlag = (row: number, col: number):void =>{
        var tempBoard = [...board];
        tempBoard.filter(tile=>{
            if(tile.row === row && tile.col === col){
                tile.flagged = !tile.flagged;
            }
            return tile;
        });
        setBoard(tempBoard);
    }

    const checkStatus = ():void =>{
        var revealNum = 0;
        for(var i=0; i<100; i++){
            if(board[i].mine===1){
                if(board[i].hidden === false){
                    setFinalText("You Lose.");
                    setGameComplete(true);
                }
            }else{
                if(board[i].hidden === false){
                    revealNum++;
                }
            }
        }
        if(revealNum === (100-mineNo)){
            setFinalText("Congratulations!!! You won the game.");
            setGameComplete(true);
        }
    }

    const newGame = ():void => {
        boardInit();
        setFirstMove(true);
        setFlags(mineNo);
        setFinalText("");
        setGameComplete(false);
    }

    return(
        <div className="board">
            {gameComplete?
                <div className="completediv">
                    <h1>{finalText}</h1>
                    <button className="start-btn" onClick={()=> newGame()}>Play Again</button>
                </div>:
                <>
                <div className="board-info">
                    <h1>{flags}</h1>
                    <b>Flags Remaining</b>
                </div>
                <div className="grid-container">
                    {board.map((tile, index) => {
                        if(tile.hidden){
                            if(tile.flagged){
                                return (
                                    <div key={index} className="grid-item grid-flagged">
                                        <div className="unflag-btn" onClick={e=>unflagTile(tile.row, tile.col)}></div>
                                    </div>
                                );
                            }else{
                                return (
                                    <div key={index} className="grid-item grid-empty">
                                        <div className="dig-btn" onClick={e=>revealTile(tile.row, tile.col)}></div>
                                        <button className="flag-btn" onClick={e=>flagTile(tile.row, tile.col)}></button>
                                    </div>
                                );
                            } 
                        }else{
                            if(tile.mine){
                                return (
                                    <div key={index} className="grid-item grid-mine grid-revealed"></div>
                                );
                            }else{
                                return (
                                    <div key={index} className="grid-item grid-number grid-revealed">
                                        {tile.num? tile.num: null}
                                    </div>
                                );
                            }
                        }
                        
                    })}
                </div>
            </>
            }
        </div>
    )
}

export default Home;