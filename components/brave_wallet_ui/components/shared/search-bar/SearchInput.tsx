import * as React from 'react'
import { SearchInput as Input } from './style';

interface IProps {
  name?: string;
  hasError?: boolean;
  type?: 'text' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?:(event: React.KeyboardEvent<HTMLInputElement>) => void
  autoFocus?: boolean;
  autoComplete?: 'off' | 'on'
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
}
const SearchInput:React.FC<IProps> = (props) => {
  return (
    <Input
      secureTextEntry={props.type === 'password'}
      placeholder={props.placeholder}
      value={props.value}
      onChangeText={(value) => {
        const target = {target: { value }} as React.ChangeEvent<HTMLInputElement>
        props.onChange?.(target)
      }}
      onKeyPress={(event) => {
        const nativeEvent = event.nativeEvent as React.KeyboardEvent<HTMLInputElement>
        props.onKeyDown?.(nativeEvent)
      }}
      onBlur={(e) => {
        props.onBlur?.(e as any)
      }}
      onFocus={(e) => {
        props.onBlur?.(e as any)
      }}
    />
  )
}

export default SearchInput