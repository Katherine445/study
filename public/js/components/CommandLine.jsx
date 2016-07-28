import React, { Component, PropTypes } from 'react';
import {getCommandHint} from '../lib/hints';
import RawHtml from './RawHtml';
import {getHint, validateCommand, execCommand} from '../lib/commands';
import {selectLastTodo} from '../actions/todos';
import {selectedCommandLine} from '../actions/app';

export default class CommandLine extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = { hint: getCommandHint() };
  }

  keyDownHandler(e) {
    switch (e.key) {
      case 'Escape':
        this.refs.ctrlInput.value = '';
        this.context.store.dispatch(selectLastTodo());
        stopEvent(e);
        break;
      case 'Tab':
        /**
         * --------------
         * trying to write autocomplete (by Katherine)
         * --------------
         */
        var command = validateCommand(this.refs.ctrlInput.value, this.context.store.getState().todos); // getting all matches

        console.log(command);
        
        /**
         * find only 1 match
         */
        if(command.length == 1){	  
          this.refs.ctrlInput.value = command[0].action + " ";	  // do autocomplete
        }else{
        console.log('here is lot more then one match');
        /**
         * found more then 1 match
         */ 
          if(command.length > 0){
            /**
             * get list of first words function names 
             */
            var firstWords = command.map(function(str, index, array){
              /**
               * get function name      
               */
              var fname = str.action;
              /**
               * get first word of camelCase function name
               */
              var matches = fname.substring(0,fname.indexOf(fname.match(/[A-Z]/)));

              return matches;
            });
            var compares = compareArray(firstWords);

            if (compares && this.refs.ctrlInput.value <= compares){
              this.refs.ctrlInput.value = compares;
            }else{
              /**
               * do nothing, waiting for input
               */
            }
          }
        }
         /**
         * ---------------
         */

        stopEvent(e);
        break;
    }
  }

  

  keyUpHandler(e) {
    switch (e.key) {
      case 'Enter':
        execCommand(this.refs.ctrlInput.value, this.context.store);
        break;
      default:
        if (this.refs.ctrlInput.value.trim() == '') {
          this.setState({ hint: getCommandHint() });
        } else {
          const commands = validateCommand(this.refs.ctrlInput.value, this.context.store.getState().todos);
          if (commands.length > 0) {
            this.setState({ hint: getHint(commands) });
          }
          //console.log(commands);
        }
    }
  }

  // TODO : think how to check app state and allow re-render
  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextState.hint !== this.state.hint;
  // }

  focusHandler() {
    const store = this.context.store;
    store.dispatch(selectedCommandLine());
  }

  componentDidUpdate() {
    const store = this.context.store;
    if (store.getState().app.focusCommandLine) {
      this.refs.ctrlInput.focus();
    }
  }

  render() {
    return (<div className="command">
              <input
                id="cmd"
                type="text"
                placeholder="Enter command"
                autoFocus="true"
                ref="ctrlInput"
                onFocus={this.focusHandler.bind(this)}
                onKeyUp={this.keyUpHandler.bind(this)}
                onKeyDown={this.keyDownHandler.bind(this)}
                />
              <RawHtml html={this.state.hint} className="hint"/>
            </div>);
  }
}

function stopEvent(e) {
  e.stopPropagation();
  e.preventDefault();
}

/**
 * written by katherine 27.07
  * function of finding equals in array
  */
  function compareArray(arr){
    var result, eqv;
    /**
     * find matches
     * if all words in array is equal, return word
     * else return undefined
     */
    
    /**
     * fix this curve hands pls =)
     */
    for (var i = 0; i < arr.length; i++){
      var compare = arr[i];
      
      for(var j=i+1; j < arr.length; j++){
        if(arr[j] == compare){
          eqv = true;
        }
         else
          eqv = false;
      }
    }
    //console.log("eqv = " + eqv);
      if (eqv == true){
        result = arr[0];
      }
      console.log(result);

    return result;
  }

/**
  * ---------**
  */