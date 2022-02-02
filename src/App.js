import React, { useState, useEffect } from "react";
import axios from "axios";
import Notes from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import noteService from "./services/notes";
// import Note from "./components/Note";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  // here we are adding a peice of state of the App component taht keeps track of which notes should be dipslayed
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
    console.log("effect");
  }, []);

  console.log("render", notes.length, "notes");

  const addNote = (event) => {
    event.preventDefault();
    // console.log("button is clicked", event.target);
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    };

    noteService.create(noteObject).then((returnedNote) => {
      //here we are nesting inside the notes list
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };
  const handleNoteChange = (event) => {
    console.log("this is event", event);
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  const toggleImportanceOf = (id) => {
    console.log("importance of" + id + "needs to be toggled");
    //defines the unique url for each resource based on its id
    let url = `https://localhost:3000/notes/${id}`;
    //the array method is used to find the note we want to modigy
    //which then assigns it to the note variable
    let note = notes.find((note) => note.id == id);
    //this is a spread operator which then gets turned into a boolean
    //we create a new object that is an exact copy of the old not
    //apart from the important property
    //{...note} creates a new object with copies of all the properties from the note object
    //
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((err) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });

    console.log("this is changed note", changedNote);
  };
  // the displayed notes (all except important) are controlled with a button.
  // in the button we are changing the text with the ternary that when clicked changes the setState value from true to false and vice versa

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);
  //notesToShows definition uses a ternary
  // if showAll is false , the notesToShow variable will be assigned to a list that only contains notes that have the important property set to true
  console.log("this is notes to showww", notesToShow.data);
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          {" "}
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) => (
          <Notes
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};
export default App;
