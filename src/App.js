import React from 'react'
import * as fb from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useBeforeunload } from 'react-beforeunload';

import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyBmKsBv1_zbe8pMTiroojBelSpr3M0nVK0",
  authDomain: "flows-c65aa.firebaseapp.com",
  databaseURL: "https://flows-c65aa.firebaseio.com",
  projectId: "flows-c65aa",
  storageBucket: "flows-c65aa.appspot.com",
  messagingSenderId: "1078341199431",
  appId: "1:1078341199431:web:8d49170f044896e143f362",
  measurementId: "G-5FM7F0QJXP"
};

fb.initializeApp(firebaseConfig);

const firebaseDb = fb.database();
const firebaseAuth = fb.auth();

const ListItem = props => {
  return (
    <div className="listItem">
      <h1>{props.name}</h1>
      <p>{props.task}</p>
    </div>
  );
}

const openModal = () => {

}

const names = ['Sondre', 'Rasmus', 'Skinne'];

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: '25px'
  },
}));


export default function App() {
  useBeforeunload(() => firebaseDb.ref().child(myKey).remove());
  
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const [flowBtn, toggleFlowBtn] = React.useState(true);
  const [btnText, setBtnText] = React.useState('Start');

  const [name, setName] = React.useState('');
  const [task, setTask] = React.useState('');

  const [flowers, setFlowers] = React.useState([]);

  const [myKey, setMyKey] = React.useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const toggleFlow = () => {
    toggleFlowBtn(!flowBtn);

    if (flowBtn) {
      setBtnText('Stop')

      firebaseDb.ref().push({
            name: name,
            task: task
        }).then((snap) => {
            setMyKey(snap.key);
        }).catch(() => {
            alert('Could not send message...');
        });
    } else {
      setBtnText('Start');

      firebaseDb.ref().child(myKey).remove();
    }
  }

  React.useEffect(() => {
    firebaseDb.ref().on('value', snapshot => {
      if(snapshot.val() !== 0) {
          const newFlowers = [];
          snapshot.forEach(childSnapshot => {
              newFlowers.push({name: childSnapshot.val().name, task: childSnapshot.val().task});
          });
          setFlowers([...newFlowers]);


      }
    });
  }, []);

  return (
    <div>
      <CssBaseline />

      <Container fixed>
        <div className="listContainer" tabIndex="0" onKeyDown={() => handleOpen()}>
          <h1>CURRENTLY IN THE FLOW <br></br> <span style={{fontWeight: '300', fontSize: 24}}>DON'T INTERRUPT UNLESS IT IS SOMETHING IMPORTANT</span></h1>
          <hr></hr>
          <br></br>
          
          {flowers.map( flower => <ListItem name={flower.name} task={flower.task} key={flower.name} />)}
        </div>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={handleClose}
        >
          <div style={modalStyle} className={classes.paper}>
            <TextField id="standard-basic" label="Navn" onChange={e => setName(e.target.value)} />
            <br></br><br></br><br></br>
            <TextField id="standard-basic" label="Task" onChange={e => setTask(e.target.value)} />
            <br></br><br></br><br></br>
            <Button variant="contained" onClick={() => toggleFlow()}>{btnText}</Button>
          </div>
        </Modal>
      </Container>
    </div>
  )
}