import React, { Component } from 'react'
import ReactDOM from "react-dom";

import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/task.js';
import Task from "./Task";
import AccountsUIWrapper from './AccountsUIWrapper';
import { Meteor } from 'meteor/meteor';


class App extends Component {
 

  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

// bien penser!!
  toggleHideCompleted(){
    this.setState({
      hideCompleted: !this.state.hideCompleted
    });
  }



  //Handle submit form : insert data into the tasks collections
  handleSubmit(event) {

    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim(); //trim clear blank espace between the caracteres
    console.log(text);

    Meteor.call('tasks.insert', text)

    //clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = "";
    <pre>DB dump: {JSON.stringify(this.props, null, " ")} </pre>

  }

  renderTasks() {

    let filteredTasks = this.props.tasks

    if(this.state.hideCompleted){

      filteredTasks = filteredTasks.filter(task => !task.checked );
      
    }
    return filteredTasks.map((task) => { 
     
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
        
        return (
          <Task
            key={task._id}
            task={task} 
            showPrivateButton={showPrivateButton}
          />

         );
    }); 

    
  }



  render() {

    return (

      <div className="container">
        <header>
          <h1> Liste de tâches ({this.props.incompleteCount})  </h1>

          <label>
              <input
                type="checkbox"
                readOnly
                checked={this.state.hideCompleted}
                onClick={this.toggleHideCompleted.bind(this)}
              />
              Hide Completed Tasks
          </label>

          <ul>{this.renderTasks()}</ul>


          <AccountsUIWrapper/>
          {
            this.props.currentUser ?

            <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
              <input type="text" ref="textInput" placeholder="Add new task" />
            </form>: ''
           }

        </header>
      </div>
    );
  }
}

export default withTracker( ()=>{
  Meteor.subscribe('tasks')
  return{

    tasks: Tasks.find({}, { sort: { createdAt: -1} } ).fetch(),

    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),

    currentUser: Meteor.user(),

  };
})(App)

