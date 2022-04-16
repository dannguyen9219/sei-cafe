import { Component } from 'react';
import { signUp } from '../../utilities/users-service';

export default class SignUpForm extends Component {
    state = {
        name: "",
        email: "",
        password: "",
        confirm: "",
        error: ""
    };

    handleChange = (evt) => {
        this.setState({...this.state, [evt.target.name]: evt.target.value, error: "" })
    };

    handleSubmit = async (evt) => {
        evt.preventDefault(); // this is to prevent the reload of the page once you hit submit; we don't want it to reload
        try {
          const {name, email, password} = this.state;
          const formData = {name, email, password};
          const user = await signUp(formData)
          localStorage.setItem('token', user)
        } catch (error) {
          this.setState({ error: "Sign Up Failed"})
        }
    };
    
    
    render() {
        const disable = this.state.password !== this.state.confirm;
        return (
          <div>
            <div className="form-container">
              <form autoComplete="off" onSubmit={this.handleSubmit}>
                <label>Name</label>
                <input type="text" name="name" value={this.state.name} onChange={this.handleChange} required />
                <label>Email</label>
                <input type="email" name="email" value={this.state.email} onChange={this.handleChange} required />
                <label>Password</label>
                <input type="password" name="password" value={this.state.password} onChange={this.handleChange} required />
                <label>Confirm</label>
                <input type="password" name="confirm" value={this.state.confirm} onChange={this.handleChange} required />
                <button type="submit" disabled={disable}>SIGN UP</button>
              </form>
            </div>
            <p className="error-message">&nbsp;{this.state.error}</p>
          </div>
        );
    };
};