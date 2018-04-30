let csrf;
let isOwner;

const renderProjects = (projects) => {
  ReactDOM.render(
    <div>
      <ProjectList csrf={csrf} projects={projects} isOwner={isOwner} />
      <div id="makeProject">
      </div>
    </div>, 
    document.querySelector("#content")
  );

  if(isOwner)
    ReactDOM.render(
      <ProjectForm csrf={csrf} />,
      document.querySelector("#makeProject")
    );
};

const loadProjectsFromServer = (csrf) => {
  const owner = $("meta[name=owner]").attr('content');
  sendAjax('GET', `/getProjects?owner=${owner}`, null, (data) => {
    renderProjects(data.projects);
  });
};

const handleProject = (e) => {
  e.preventDefault();

  if($("#projectName").val() == '' || $("#projectLink").val() == '' || $("#projectDescription").val() == '') {
    handleError("all fields");
    return false;
  }
  const csrf = $("#csrf").val();
  sendFormDataAjax($("#projectForm").attr("action"), new FormData(document.querySelector("#projectForm")), function() {
    loadProjectsFromServer(csrf);
  });

  return false;
};

const handleChangePassword = (e) => {
  e.preventDefault();

  if($("#pass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if($("#newPass").val() !== $("#newPass2").val()) {
    handleError("Passwords don't match");
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);

  return false;
};

const deleteProject = (csrf, name) => {
  sendAjax('DELETE', `/deleteProject?_csrf=${csrf}&name=${name}`, null, () => {
    loadProjectsFromServer(csrf);
  });
};

const ProjectForm = (props) => {
  return (
    <div className="innercolumn">
      <form id="projectForm"
        onSubmit={handleProject}
        name="projectForm"
        action="/addProject"
        method="POST"
        className="mainForm"
        encType="multipart/form-data"
      >
        <label htmlFor="name">Name: </label>
        <input id="projectName" type="text" name="name" placeholder="Project name" />
        <label htmlFor="image">Image: </label>
        <input id="projectImage" type="file" name="image" accept="image/*"/>
        <label htmlFor="link">Link: </label>
        <input id="projectName" type="text" name="link" placeholder="Link to project" />
        <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
        <textarea name="description" form="projectForm" placeholder="Project description"></textarea>
        <input className="formSubmit" type="submit" value="Add Project" />
      </form>
    </div>
  );
};

const Project = (props) => {
  const project = props.project;
  return (
    <div key={project.id} className="item">
      <h3>{project.name}</h3>
      {project.image && <img src={project.image} alt="" />}
      <p>{project.description}</p>
      {project.link && <a href={project.link}>Link</a>}
      {props.isOwner && <button onClick={() => deleteProject(csrf, project.name)}>Delete</button>}      
    </div>
  );
};

const ProjectList = function(props) {
  if(props.projects.length === 0) {
    return (
      <div className="projectList">
        <h3 className="emptyProject">No Projects yet</h3>
      </div>
    );
  }

  const projectNodes = props.projects.map(function(project) {
    return (<Project project={project} isOwner={isOwner} />);
  });

  return (
    <div className="innercolumn">
      {projectNodes}
    </div>
  );
};

const PassChangeForm = (props) => {
  return (
    <form id="changePassForm"
      name="changePassForm"
      onSubmit={handleChangePassword}
      action="/changePassword"
      method="POST"
      className="mainForm"
    >
      <label htmlFor="pass">Current: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="newPass">New: </label>
      <input id="newPass" type="password" name="newPass" placeholder="new password" />
      <label htmlFor="newPass2">New: </label>
      <input id="newPass2" type="password" name="newPass2" placeholder="retype new password" />
      <input type="hidden" name="_csrf" value={csrf} />
      <input className="formSubmit" type="submit" value="Change" />
    </form>
  );
};

const renderPassChange = (e) => {
  e.preventDefault();
  ReactDOM.render(
    <PassChangeForm />,
    document.querySelector('#content')
  );
  return false;
};

const renderPremiumPage = () => {
  const dummyProject = {
    name: "Go Premium! Buy More!",
    image: "http://i2.cdn.turner.com/money/dam/assets/150126095901-stocks-to-buy-780x439.jpg",
    description: "Would you like to BUY MORE? By purchasing a premium membership to PORTFOLIATOR, you can gain access to such wonderful features as: custom stylesheets, etc.!\n\nWould you like to BUY MORE? Yes! Premium PORTFOLIATOR memberships will be available soon!"
  };

  ReactDOM.render(
    <div className="innercolumn">
      <Project project={dummyProject} isOwner={false} />
    </div>,
    document.querySelector('#content')
  );
};

const NavItems = (props) => {
  if(props.isOwner)
    return (
      <div>
        <li><a href="#" onClick={setup}>Home</a></li>
        <li><a href="#" onClick={renderPassChange}>Change Password</a></li>
        <li><a href="#" onClick={renderPremiumPage}>Go Premium</a></li>
        <li><a href="/logout">Logout</a></li>
      </div>
    );
  else {
    const ownerName = $("meta[name=ownerName").attr('content');
    return (
      <li><a href="#" onClick={setup}>{ownerName}'s Portfolio</a></li>
    );
  }
};

const NavBar = (props) => {
  return (
    <ul>
      <NavItems isOwner={props.isOwner} />
    </ul>
  );
};

const setup = function() {  
  isOwner = Boolean($("meta[name=isOwner]").attr('content'));

  ReactDOM.render(
    <NavBar isOwner={isOwner} />, document.querySelector("#nav")
  );

  loadProjectsFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    csrf = result.csrfToken;
    setup();
  });
};

$(document).ready(function() {
  getToken();
});