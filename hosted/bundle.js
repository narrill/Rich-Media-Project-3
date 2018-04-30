"use strict";

var csrf = void 0;
var isOwner = void 0;

var renderProjects = function renderProjects(projects) {
  ReactDOM.render(React.createElement(
    "div",
    null,
    React.createElement(ProjectList, { csrf: csrf, projects: projects, isOwner: isOwner }),
    React.createElement("div", { id: "makeProject" })
  ), document.querySelector("#content"));

  if (isOwner) ReactDOM.render(React.createElement(ProjectForm, { csrf: csrf }), document.querySelector("#makeProject"));
};

var loadProjectsFromServer = function loadProjectsFromServer(csrf) {
  var owner = $("meta[name=owner]").attr('content');
  sendAjax('GET', "/getProjects?owner=" + owner, null, function (data) {
    renderProjects(data.projects);
  });
};

var handleProject = function handleProject(e) {
  e.preventDefault();

  if ($("#projectName").val() == '' || $("#projectLink").val() == '' || $("#projectDescription").val() == '') {
    handleError("all fields");
    return false;
  }
  var csrf = $("#csrf").val();
  sendFormDataAjax($("#projectForm").attr("action"), new FormData(document.querySelector("#projectForm")), function () {
    loadProjectsFromServer(csrf);
  });

  return false;
};

var handleChangePassword = function handleChangePassword(e) {
  e.preventDefault();

  if ($("#pass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
    handleError("Passwords don't match");
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);

  return false;
};

var deleteProject = function deleteProject(csrf, name) {
  sendAjax('DELETE', "/deleteProject?_csrf=" + csrf + "&name=" + name, null, function () {
    loadProjectsFromServer(csrf);
  });
};

var ProjectForm = function ProjectForm(props) {
  return React.createElement(
    "div",
    { className: "innercolumn" },
    React.createElement(
      "form",
      { id: "projectForm",
        onSubmit: handleProject,
        name: "projectForm",
        action: "/addProject",
        method: "POST",
        className: "mainForm",
        encType: "multipart/form-data"
      },
      React.createElement(
        "label",
        { htmlFor: "name" },
        "Name: "
      ),
      React.createElement("input", { id: "projectName", type: "text", name: "name", placeholder: "Project name" }),
      React.createElement(
        "label",
        { htmlFor: "image" },
        "Image: "
      ),
      React.createElement("input", { id: "projectImage", type: "file", name: "image", accept: "image/*" }),
      React.createElement(
        "label",
        { htmlFor: "link" },
        "Link: "
      ),
      React.createElement("input", { id: "projectName", type: "text", name: "link", placeholder: "Link to project" }),
      React.createElement("input", { id: "csrf", type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("textarea", { name: "description", form: "projectForm", placeholder: "Project description" }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "Add Project" })
    )
  );
};

var Project = function Project(props) {
  var project = props.project;
  return React.createElement(
    "div",
    { key: project.id, className: "item" },
    React.createElement(
      "h3",
      null,
      project.name
    ),
    project.image && React.createElement("img", { src: project.image, alt: "" }),
    React.createElement(
      "p",
      null,
      project.description
    ),
    project.link && React.createElement(
      "a",
      { href: project.link },
      "Link"
    ),
    props.isOwner && React.createElement(
      "button",
      { onClick: function onClick() {
          return deleteProject(csrf, project.name);
        } },
      "Delete"
    )
  );
};

var ProjectList = function ProjectList(props) {
  if (props.projects.length === 0) {
    return React.createElement(
      "div",
      { className: "projectList" },
      React.createElement(
        "h3",
        { className: "emptyProject" },
        "No Projects yet"
      )
    );
  }

  var projectNodes = props.projects.map(function (project) {
    return React.createElement(Project, { project: project, isOwner: isOwner });
  });

  return React.createElement(
    "div",
    { className: "innercolumn" },
    projectNodes
  );
};

var PassChangeForm = function PassChangeForm(props) {
  return React.createElement(
    "form",
    { id: "changePassForm",
      name: "changePassForm",
      onSubmit: handleChangePassword,
      action: "/changePassword",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Current: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "newPass" },
      "New: "
    ),
    React.createElement("input", { id: "newPass", type: "password", name: "newPass", placeholder: "new password" }),
    React.createElement(
      "label",
      { htmlFor: "newPass2" },
      "New: "
    ),
    React.createElement("input", { id: "newPass2", type: "password", name: "newPass2", placeholder: "retype new password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Change" })
  );
};

var renderPassChange = function renderPassChange(e) {
  e.preventDefault();
  ReactDOM.render(React.createElement(PassChangeForm, null), document.querySelector('#content'));
  return false;
};

var renderPremiumPage = function renderPremiumPage() {
  var dummyProject = {
    name: "Go Premium! Buy More!",
    image: "http://i2.cdn.turner.com/money/dam/assets/150126095901-stocks-to-buy-780x439.jpg",
    description: "Would you like to BUY MORE? By purchasing a premium membership to PORTFOLIATOR, you can gain access to such wonderful features as: custom stylesheets, etc.!\n\nWould you like to BUY MORE? Yes! Premium PORTFOLIATOR memberships will be available soon!"
  };

  ReactDOM.render(React.createElement(
    "div",
    { className: "innercolumn" },
    React.createElement(Project, { project: dummyProject, isOwner: false })
  ), document.querySelector('#content'));
};

var NavItems = function NavItems(props) {
  if (props.isOwner) return React.createElement(
    "div",
    null,
    React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { href: "#", onClick: setup },
        "Home"
      )
    ),
    React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { href: "#", onClick: renderPassChange },
        "Change Password"
      )
    ),
    React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { href: "#", onClick: renderPremiumPage },
        "Go Premium"
      )
    ),
    React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { href: "/logout" },
        "Logout"
      )
    )
  );else {
    var ownerName = $("meta[name=ownerName").attr('content');
    return React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { href: "#", onClick: setup },
        ownerName,
        "'s Portfolio"
      )
    );
  }
};

var NavBar = function NavBar(props) {
  return React.createElement(
    "ul",
    null,
    React.createElement(NavItems, { isOwner: props.isOwner })
  );
};

var setup = function setup() {
  isOwner = Boolean($("meta[name=isOwner]").attr('content'));

  ReactDOM.render(React.createElement(NavBar, { isOwner: isOwner }), document.querySelector("#nav"));

  loadProjectsFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    csrf = result.csrfToken;
    setup();
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var ErrorMessage = function ErrorMessage(props) {
  return React.createElement(
    "h3",
    { className: "error" },
    props.message
  );
};

var handleError = function handleError(message) {
  ReactDOM.render(React.createElement(ErrorMessage, { message: message }), document.querySelector('#error'));
  window.setTimeout(function () {
    ReactDOM.render(React.createElement(ErrorMessage, { message: "" }), document.querySelector('#error'));
  }, 5000);
};

var redirect = function redirect(response) {
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

var sendFormDataAjax = function sendFormDataAjax(action, data, callback) {
  $.ajax({
    cache: false,
    type: 'POST',
    url: action,
    data: data,
    processData: false,
    contentType: false,
    success: callback,
    error: function error(xhr, status, _error2) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
