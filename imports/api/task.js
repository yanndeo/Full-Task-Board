
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from "meteor/check";



export const Tasks = new Mongo.Collection("tasks");


/////////////////////////////___PUBLICATION__/////////////////////////////


if (Meteor.isServer) {

    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
          $or:[
            { private: {$ne: true}},
            { owner:this.userId},
          ],
        });
    });
}

///////////////////////////__METHODS__/////////////////////////////

Meteor.methods({
  "tasks.insert"(text) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      private: false
    });
  },

  //////////////////////////////////////////////////////////////

  "tasks.remove"(taskID) {
    check(taskID, String);

    const task = Tasks.findOne(taskID);
    if (task.private && task.owner !== this.userId) {
      //verfions qu'il en est bien propriétaire
      throw new Meteor.Error("not-authorized");
    }
    Tasks.remove(taskID);
  },

  //////////////////////////////////////////////////////////////

  "tasks.setChecked"(taskID, setChecked) {
    check(taskID, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskID);
    if (task.private && task.owner !== this.userId) {
      //verfions qu'il en est bien propriétaire
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskID, { $set: { checked: setChecked } });
  },

  //////////////////////////////////////////////////////////////
  
  "tasks.setPrivate"(taskID, setToPrivate) {
    check(taskID, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskID);
    if (task.owner !== this.userId) {
      //verfions qu'il en est bien propriétaire
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskID, { $set: { private: setToPrivate } });
  }
});





