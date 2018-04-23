'use strict';

var loadProjectsFromServer = function loadProjectsFromServer(csrf) {
  var owner = $("meta[name=owner]").attr('content');
  sendAjax('GET', '/getProjects?owner=' + owner, null, function (data) {
    ReactDOM.render(React.createElement(ProjectList, { csrf: csrf, projects: data.projects }), document.querySelector("#projects"));
  });
};

var handleProject = function handleProject(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#projectName").val() == '' || $("#projectLink").val() == '' || $("#projectDescription").val() == '') {
    handleError("all fields");
    return false;
  }
  var csrf = $("#csrf").val();
  sendAjax('POST', $("#projectForm").attr("action"), $("#projectForm").serialize(), function () {
    loadProjectsFromServer(csrf);
  });

  return false;
};

var deleteProject = function deleteProject(csrf, name) {
  sendAjax('DELETE', '/deleteProject?_csrf=' + csrf + '&name=' + name, null, function () {
    loadProjectsFromServer(csrf);
  });
};

var ProjectForm = function ProjectForm(props) {
  return React.createElement(
    'form',
    { id: 'projectForm',
      onSubmit: handleProject,
      name: 'projectForm',
      action: '/addProject',
      method: 'POST',
      className: 'projectForm'
    },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'projectName', type: 'text', name: 'name', placeholder: 'Project name' }),
    React.createElement(
      'label',
      { htmlFor: 'link' },
      'Link: '
    ),
    React.createElement('input', { id: 'projectName', type: 'text', name: 'link', placeholder: 'Link to project' }),
    React.createElement('input', { id: 'csrf', type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement(
      'textarea',
      { name: 'description', form: 'projectForm' },
      'Enter a description'
    ),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Add Project' })
  );
};

var ProjectList = function ProjectList(props) {
  if (props.projects.length === 0) {
    return React.createElement(
      'div',
      { className: 'projectList' },
      React.createElement(
        'h3',
        { className: 'emptyProject' },
        'No Projects yet'
      )
    );
  }

  var projectNodes = props.projects.map(function (project) {
    return React.createElement(
      'div',
      { key: project.id, className: 'project' },
      React.createElement(
        'h3',
        { className: 'projectName' },
        ' Name: ',
        project.name,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'projectLink' },
        ' Link: ',
        project.link,
        ' '
      ),
      React.createElement(
        'p',
        { className: 'projectDescription' },
        ' ',
        project.description,
        ' '
      ),
      React.createElement(
        'button',
        { onClick: function onClick() {
            return deleteProject(props.csrf, project.name);
          } },
        'Delete'
      )
    );
  });

  return React.createElement(
    'div',
    { className: 'domoList' },
    projectNodes
  );
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(ProjectForm, { csrf: csrf }), document.querySelector("#makeProject"));

  ReactDOM.render(React.createElement(ProjectList, { csrf: csrf, projects: [] }), document.querySelector("#projects"));

  loadProjectsFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";
// class NoteList extends React.Component {
//   constructor(notes) {
//     this.notes = notes;
//   }

//   render() {
//     return 
//   }
// }
"use strict";
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
