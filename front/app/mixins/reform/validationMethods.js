module.exports = {
    length (value){
        return (value.length && value.length > 4);
    },
    min (value, min) {
        min = parseInt(min);
        return (value && value.length && (value.length >= min));
    },
    max (value, max) {
        max = parseInt(max);
        return (value && value.length && (value.length <= max));
    },
    email: function(email){
        if(email === undefined || email === '') return true;
        return email && email.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
    },
    phone: function(phone){
        if(phone === undefined || phone === '') return true;
        return phone && phone.match(/^[0-9]{9,10}$/);
    },
    mobile: function(mobile){
        if(mobile === undefined || mobile === '') return true;
        return mobile && mobile.match(/^[0-9]{10}$/);
    }
};