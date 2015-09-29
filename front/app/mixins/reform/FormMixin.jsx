
var { batch, stopEvent } = require('./utils');

function addListeners(component) {
    var element = component.getDOMNode();
    if(!element) return;
    element.addEventListener('form.input.register', component.registerInput, true);
    element.addEventListener('form.input.unregister', component.unRegisterInput, true);
}

function removeListeners(component) {
    var element = component.getDOMNode();
    element.removeEventListener('form.input.register', component.registerInput, true);
    element.removeEventListener('form.input.unregister', component.unRegisterInput, true);
}

module.exports = {
    getInitialState () {
        return {
            isValid: true,
            isPristine: true,
            inputs: {},
            validations: []
        };
    },
    componentDidMount(){
        // for some reason we need to wait for the next cycle to access the dom element
        //console.log('form mounted');
        setTimeout(() => { addListeners(this); }, 0);
    },
    componentWillUnmount(){
        //console.log('form unmounted');
        removeListeners(this);
    },
    registerInput(event) {
        stopEvent(event);
        var input = event.detail,
            inputs = this.state.inputs,
            name = input.props.name;
        //console.log('registering input', input.props.name);
        //console.dir(input);
        if(!name) return console.error('form input requires a name property');
        if(inputs[name]) return console.error('there are two inputs named ' + name);
        if(!input.props.cursor) {    //  we require a cursor property to keep things simple
            return console.error('InputMixin requires a cursor property as an object with get and set functions');
        }
        inputs[name] = input;
        if(!this.state.isPristine) batch(this.validate);
    },
    unRegisterInput(event) {
        stopEvent(event);
        var input = event.detail,
            inputs = this.state.inputs,
            name = input.props.name;
        //console.dir(input);
        if(!inputs[name]) return console.error(name + ' tried to unregister but was not registered');
        delete inputs[name];
        if(!this.state.isPristine) batch(this.validate);
    },
    validate(){
        var inputs = this.state.inputs,
            formIsValid = true,
            validations = [],
            inputIsValid;
        //console.log('validating form');
        for(var name in inputs){
            inputIsValid = inputs[name].validate();     //  validate the input.
            formIsValid = (inputIsValid && formIsValid);
            validations.push({
                name: name,
                valid: inputIsValid,
                formValid: formIsValid
            });
        }
        this.setState({
            isValid: formIsValid,
            isPristine: false,
            validations: validations
        });
        return formIsValid;
    },
    invalidate (inputName, error){
        var input = this.state.inputs[inputName];
        if(input){
            input.invalidate(error);
        }
        else{
            console.error('cannot find input called ' + inputName);
        }
    },
    submit () {
        var valid = this.validate();
        if(valid && this.onSubmit) this.onSubmit();
    }
};



///  customEvent polyfill

