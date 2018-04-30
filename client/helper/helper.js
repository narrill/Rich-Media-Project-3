const ErrorMessage = (props) => {
  return (
    <h3 className="error">{props.message}</h3>
  );
};

const handleError = (message) => {
  ReactDOM.render(
    <ErrorMessage message={message} />,
    document.querySelector('#error')
  );
  window.setTimeout(() => {
    ReactDOM.render(
      <ErrorMessage message={""} />,
      document.querySelector('#error')
    );
  }, 5000);
};

const redirect = (response) => {
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  })
};

const sendFormDataAjax = (action, data, callback) => {
  $.ajax({
    cache: false,
    type: 'POST',
    url: action,
    data: data,
    processData: false,
    contentType: false,
    success: callback,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};