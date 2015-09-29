
var validationMethods = require('./validationMethods');
module.exports = {
    getInitialState () {
        if(!this.props.cursor) return console.error('Input mixin requires a cursor property');
        var value = this.props.cursor.get();
        return {
            initialValue: value,
            lastValue: value,
            isPristine: true,
            isValid: true,
            error: null
        };
    },
    dispatch (eventName) {
        var event = new CustomEvent(eventName, { detail: this });
        var element = this.getDOMNode();
        return element.dispatchEvent(event);
    },
    componentDidMount(){
        //console.log('input mounted');
        // registers the input with the form.
        // we need to wait for the wrapping form to be on the DOM, in case are inside a nested component.
        setTimeout(()=>{
            //console.log('input dispatch');
            this.dispatch('form.input.register');
        }, 100);
    },
    componentWillUnmount(){
        this.dispatch('form.input.unregister');
    },
    componentWillReceiveProps(props){     // this triggers the internal validation of the input component. will trigger a validation only if the value has changed

        if(!props.cursor) return console.error('Input mixin cannot find a cursor property in componentWillReceiveProps');
        value = props.cursor.get();

        if(value !== this.state.lastValue){
            if(this.state.isPristine) return;
            var value;
            console.log('p');
            this.setState({
                lastValue: value
            });
            setTimeout( ()=> {
                this.validate();
            }, 10);
        }

    },
    validate: function(){
        //console.log('validating input', this.props.name);
        var required = this.props.required,
            value = this.props.cursor.get(),
            validations = this.props.validations,
            isEmpty = (!value),
            args, name, valid;
        this.setState({
            isPristine: false
        });
        if(required && isEmpty){       // if a field is required and it is empty validation fails, and state.error will be the value of the required attribute of the input component.
            this.setState({
                error: required,
                isValid: false
            });
            return false;
        }

        for(var nameWithArgs in validations){    // test all validations in props one until one fails.
            args = nameWithArgs.split(':');
            name = args.shift();
            if(validationMethods[name]){
                args.unshift(value);
                valid = validationMethods[name].apply(null, args);    // call this validation method with arguments. note that the value is the first argument
                if(!valid){
                    this.setState({                         // if a validation failed, state.error will be the value of the failed validation in the validations attribute of the input component
                        error: validations[nameWithArgs],
                        isValid: false
                    });
                    return false;
                }
            }
            else console.warn('validation ' + name + ' is not defined');
        }
        this.setState({     // if none of the validations failed this input is valid.
            isValid: true,
            error: null
        });
        return true;
    },
    invalidate(err){
        this.setState({                         // if a validation failed, state.error will be the value of the failed validation in the validations attribute of the input component
            error: err,
            isValid: false
        });
    }
};