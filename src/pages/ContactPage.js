import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, Button } from "../components";
import { requestPost } from "../requests";

const ContactPage = withRouter(({ match, history, location }) => {
  const [contact, setContact] = useState("");
  
  useEffect(() => {
    const init = async () => {      
      // Extract contact_id from route
      let id = location.pathname;
      id = id.substr(id.lastIndexOf('/') + 1);
      
      // Read contact information
      let res = await requestPost("/api/crudContact", { crud: "read", contact_id: id });
      if (res) {
        console.log(res);
        setContact(res);
      } else {
        setContact([]);
      }
    };
    init ();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {contact == null && <Heading>Loading...</Heading>}
      {contact && <Heading>{contact.contact_name}</Heading>}
    </div>
  );
});

export default ContactPage;
