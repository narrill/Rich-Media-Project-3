const loadProjectsFromServer = (csrf) => {
  const owner = $("meta[name=owner]").attr('content');
  sendAjax('GET', `/getProjects?owner=${owner}`, null, (data) => {
    ReactDOM.render(
      <ProjectList csrf={csrf} projects={data.projects} />, document.querySelector("#projects")
    );
  });
};

const handleProject = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({width: 'hide'}, 350);

  if($("#projectName").val() == '' || $("#projectLink").val() == '' || $("#projectDescription").val() == '') {
    handleError("all fields");
    return false;
  }
  const csrf = $("#csrf").val();
  sendAjax('POST', $("#projectForm").attr("action"), $("#projectForm").serialize(), function() {
    loadProjectsFromServer(csrf);
  });

  return false;
};

const deleteProject = (csrf, name) => {
  sendAjax('DELETE', `/deleteProject?_csrf=${csrf}&name=${name}`, null, () => {
    loadProjectsFromServer(csrf);
  });
};

const ProjectForm = (props) => {
  return (
    <form id="projectForm"
      onSubmit={handleProject}
      name="projectForm"
      action="/addProject"
      method="POST"
      className="projectForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="projectName" type="text" name="name" placeholder="Project name" />
      <label htmlFor="link">Link: </label>
      <input id="projectName" type="text" name="link" placeholder="Link to project" />
      <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
      <textarea name="description" form="projectForm">Enter a description</textarea>
      <input className="makeDomoSubmit" type="submit" value="Add Project" />
    </form>
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
    return (
      <div key={project.id} className="project">
        <h3 className="projectName"> Name: {project.name} </h3>
        <h3 className="projectLink"> Link: {project.link} </h3>
        <p className="projectDescription"> {project.description} </p>
        <button onClick={() => deleteProject(props.csrf, project.name)}>Delete</button>
      </div>
    );
  });

  return (
    <div className="domoList">
      {projectNodes}
    </div>
  );
};

const setup = function(csrf) {
  ReactDOM.render(
    <ProjectForm csrf={csrf} />, document.querySelector("#makeProject")
  );

  ReactDOM.render(
    <ProjectList csrf={csrf} projects={[]} />, document.querySelector("#projects")
  );

  loadProjectsFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});