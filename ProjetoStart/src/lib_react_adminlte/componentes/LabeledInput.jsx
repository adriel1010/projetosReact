import React from 'react';
import Input from './Input.jsx';

export default props => (
  <div className="labeled-input">
    <label htmlFor={props.name}>{props.label}</label>
    <Input value={props.value}
           onChange={props.onChange}
           onChange2={props.onChange2}
           placeholder={props.placeholder}
           readOnly={props.readOnly}
           disabled={props.disabled}
           type={props.type}
           min={props.min}
           ref={props.inputRef}
           max={props.max}
           disableSpaces={props.disableSpaces}
           onKeyEnter={props.onKeyEnter}
           onKeyDown={props.onKeyDown}
           onFocus={props.onFocus}
           className={props.className}
           target={props.target}
           field={props.field}
           uppercase={props.uppercase}
           style={props.style}
           placeholder={props.placeholder} />
  </div>
);
