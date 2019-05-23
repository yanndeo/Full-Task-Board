import React, { Component } from 'react'
import { Tasks } from '../api/task';
import { Meteor } from 'meteor/meteor';
import classnames from "classnames";




//TASK Component using meteor methods . 

class Task extends Component {

  toggleChecked(){
    console.log(this.props.task)
    Meteor.call("tasks.setChecked", this.props.task._id, !this.props.task.checked );

  }

  deleteThisTask() {
      //Tasks.remove(this.props.task._id);
     Meteor.call('tasks.remove', this.props.task._id );
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
  }


  render() {

    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });

    return (

      <li className={taskClassName}>

        <button
          className="delete"
          onClick={this.deleteThisTask.bind(this)} >
          &times;
        </button>

        <input
         type="checkbox"
         readOnly
         checked={!!this.props.task.checked}
         onClick={this.toggleChecked.bind(this)} />

        {
          this.props.showPrivateButton
         ?
          (<button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.task.private ? 'Private' : 'Public' }
          </button>)
          :
            ''
          }

        <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </span>

      </li>

    );
  }
}

export default Task
