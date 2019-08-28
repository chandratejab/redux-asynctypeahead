import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTags, clearDataByType } from './actions';
import { CLEAR_TAG_DATA } from './types';

class Autocomplete extends Component {
  componentDidMount() {
    const { existingTags } = this.props
    this.props.setTags(this.props.name, {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: "",
      addedTags: this.props.autocomplete[this.props.name] 
                    ? this.props.autocomplete[this.props.name].addedTags 
                    : null 
                  || existingTags 
    })
  }

  componentWillUnmount() {
    this.props.clearDataByType(CLEAR_TAG_DATA)
  }

  onChange = e => {
    const userInput = e.currentTarget.value;

    if (userInput)
      this.props.searchTags(userInput, this.props.autocomplete[this.props.name].addedTags)

    this.props.setTags(this.props.name, {
      activeSuggestion: 0,
      showSuggestions: true,
      userInput: e.currentTarget.value
    })
  };

  onClick = e => {
    const filteredSuggestions = this.props.autocomplete.filteredTags
    const addedTags = [ 
      ...this.props.autocomplete[this.props.name].addedTags, 
      filteredSuggestions[filteredSuggestions.findIndex(suggestion => suggestion.name === e.currentTarget.innerText)] 
        || this.props.autocomplete[this.props.name].userInput
    ]
    this.props.setTags(this.props.name, {
      activeSuggestion: 0,
      showSuggestions: false,
      addedTags,
      userInput: '',
    })
    this.props.setResult(addedTags)
  };

  removeTag = tag => {
    const addedTags = [...this.props.autocomplete[this.props.name].addedTags.filter(ele => ele._id !== tag._id)]
    this.props.setTags(this.props.name, { addedTags })
    this.props.setResult(addedTags)
  }

  onKeyDown = e => {
    const { activeSuggestion } = this.props.autocomplete[this.props.name];
    const filteredSuggestions = this.props.autocomplete.filteredTags
    const addedTags = [ 
      ...this.props.autocomplete[this.props.name].addedTags, 
      filteredSuggestions[activeSuggestion] || this.props.autocomplete[this.props.name].userInput]
    
    // User pressed the enter key
    if (e.keyCode === 13) {
      this.props.setTags(this.props.name, {
        activeSuggestion: 0,
        showSuggestions: false,
        addedTags,
        userInput: "" 
      })
      this.props.setResult(addedTags)
      e.preventDefault()
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.props.setTags(this.props.name, { activeSuggestion: activeSuggestion - 1 })
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.props.setTags(this.props.name, { activeSuggestion: activeSuggestion + 1 })
    }
  };

  render() {
    if (!this.props.autocomplete[this.props.name]) {
      return null
    }

    const {
      onChange,
      onClick,
      onKeyDown,
    } = this;

    const {
      activeSuggestion,
      showSuggestions,
      userInput
    } = this.props.autocomplete[this.props.name]

    let { addedTags } = this.props.autocomplete[this.props.name]

    if (!addedTags) {
      addedTags = this.props.existingTags || []
      if (this.props.existingTags) {
        addedTags = this.props.existingTags
        this.props.setTags(this.props.name, { addedTags })
      } else {
        addedTags = []
      }
    }

    let filteredSuggestions = this.props.autocomplete.filteredTags
    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li className={className} key={suggestion.name} onClick={onClick}>
                  {suggestion.name}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        );
      }
    }
    return (
      <div>
        <label>{this.props.label}</label>
        <input
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
          autoComplete="off"
        />
        {suggestionsListComponent}
        <div>
          {addedTags.map(tag => (
            <span 
              className="badge" 
              key={tag._id}
              onClick={() => this.removeTag(tag)}>
              {tag.name}
            </span>))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ autocomplete }) => {
  return { 
    autocomplete
  }
}

export default connect(mapStateToProps, {
  setTags,
  clearDataByType
})(Autocomplete);
