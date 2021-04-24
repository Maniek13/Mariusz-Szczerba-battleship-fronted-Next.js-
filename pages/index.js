import React from 'react'
import Head from 'next/head'
import Status from './components/status'
import styles from './styles/index.module.css'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Status: "Want to see battle?",
      GameStatus: 2,
      Action: "Start",
      Pause: false,
      GameId: 0,
      Player: 1,
      Next: true
    };
    this.board1 = [];
    this.board2 = [];
  }

  componentDidUpdate(){
    if(this.state.Pause == true){
      if(this.interval != false){
        clearInterval(this.interval);
        this.interval = false;
      }
    }
    else{
      if(this.interval == false){
        this.interval = setInterval(() => this.game(), 500);
      } 
    }
  }

  startGame() {
    switch (this.state.GameStatus) {
      case 0:
          this.setState({ Action: "Pause" });
          this.setState({ GameStatus: 1 });
          this.setState({ Pause: false });
          this.setState({ Status : "Whait..."})
        break;
      case 1:
          this.setState({ Status : "Pause"})
          this.setState({ Action: "Start" });
          this.setState({ GameStatus: 0 });
          this.setState({ Pause: true });
        break;
      case 2:
          this.strips();
          this.setState({ GameStatus: 1 });
          this.setState({ Action: "Pause" });
          this.setState({ Pause: false });
        break
    }
  }

  async strips(){
    this.setState({Status : "Loading..."})
    const res = await fetch('https://localhost:44307/battleship/ships');
    const odp = await res.json();
  
    this.setState({ GameId: odp.GameId });
      for(let i = 0; i<100; ++i){
        if(odp.StripP1[i] != 0){
          document.getElementById("player1").childNodes[i].style.backgroundColor = "red";
        }
        else{
          document.getElementById("player1").childNodes[i].style.backgroundColor = 'rgb(233, 233, 233)';
        }

        if(odp.StripP2[i] != 0){
          document.getElementById("player2").childNodes[i].style.backgroundColor = "red";
        }
        else{
          document.getElementById("player2").childNodes[i].style.backgroundColor = 'rgb(233, 233, 233)';
        }
      }

    this.interval = setInterval(() => this.game(), 500);
    this.setState({Status : "The game will start in a moment"});
  }

  async game(){
    var odp;

    if(this.state.Pause != true)
    this.setState({Status : "Player " + this.state.Player + " move"});

    if(this.state.Pause != true){
      if(this.state.Next == true){
        const res = await fetch('https://localhost:44307/battleship/moves?gameId=' + this.state.GameId + '&player=' + this.state.Player + '&next=false');
        const reply = await res.json();
        odp = reply;
        this.setState({Next : false});
      }
      else{
        const res = await fetch('https://localhost:44307/battleship/moves?gameId=' + this.state.GameId + '&player=' + this.state.Player + '&next=true');
        const reply = await res.json();
        odp = reply;
        if(reply.Message == 4){
          this.setState({Next : true})
        }
      }

      switch(Number(odp.Message)){
        case 1:
            this.setState({Player : 2});
            if(odp.Hit == 0){
              document.getElementById("player2").childNodes[odp.Field].style.backgroundColor = "blue";
            }
            else{
              document.getElementById("player2").childNodes[odp.Field].style.backgroundColor = "black";
            }
          break;
        case 2:
            this.setState({Player : 1});
              if(odp.Hit == 0){
                document.getElementById("player1").childNodes[odp.Field].style.backgroundColor = "blue";
              }
              else{
                document.getElementById("player1").childNodes[odp.Field].style.backgroundColor = "black";
              }
          break;
        case 3:
            clearInterval(this.interval);

              if(this.state.Player == 1){
                document.getElementById("player2").childNodes[odp.Field].style.backgroundColor = "black";
              }
              else{
                document.getElementById("player1").childNodes[odp.Field].style.backgroundColor = "black";
              }
        
            this.setState({ Action: "Start" });
            this.setState({ GameStatus: 2 });
            this.setState({ Pause: false });
            this.setState({ Status: "Win player number "  + this.state.Player});
          break;
        case 4:
          break;
        case 5:
            clearInterval(this.interval);
            this.setState({ Action: "Start" });
            this.setState({ GameStatus: 2 });
            this.setState({ Pause: false });
            this.setState({ Status: "Server return: 'To long time to wait for move'. Please start again."});
          break;
        case -1:
          break;
      }
    }
  }

  render() {
    let fields = [];

    for (let i = 0; i < 100; ++i){
        fields.push(<div key={i} value={i} id={i} />)
    }

    return (
      <React.Fragment>
        <Head>
          <title>Battleship</title>
        </Head>
        <Status status={this.state.Status} />
        <div className={styles.conteinerBoard}>
          <div id="player1" className={styles.board}>
            {fields}
          </div>
          <div id="player2" className={styles.board}>
            {fields}
          </div>
        </div>
        <div className={styles.conteinerButton}>
          <button className={styles.start} onClick={this.startGame.bind(this)}>{this.state.Action}</button>
        </div>
      </React.Fragment>
    );
  }
}

export default App;

