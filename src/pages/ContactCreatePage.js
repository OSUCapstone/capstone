import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, TextInput, Button } from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const ContactCreatePage = withRouter(({ match, history, location }) => {
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleCreateContact = async () => {
    try {
      let success =  await requestPost(
        '/api/crudContact',
        {
          crud: 'create',
          contact_name: `${contact}`,
          company_id: `${company}`,
          role: `${role}`,
          email: `${email}`,
          phone_number: `${phone}`,
        }
      );

      if (success) {
        history.push(Routes.CONTACTS_PAGE);
      } else {
        console.log('Failed to create contact!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Heading>Contacts</Heading>
      <div className="my-2">
        <TextInput
          value={contact}
          setValue={setContact}
          placeholder="Enter contact name..."
        />
        <TextInput
          value={company}
          setValue={setCompany}
          placeholder="Enter company id..."
        />
        <TextInput
          value={role}
          setValue={setRole}
          placeholder="Enter role..."
        />
        <TextInput
          value={email}
          setValue={setEmail}
          placeholder="Enter email..."
        />
        <TextInput
          value={phone}
          setValue={setPhone}
          placeholder="Enter phone number..."
        />
      </div>
      <div className="my-2">
        <Button onClick={handleCreateContact}>Add Contact</Button>
      </div>
    </div>
  );
});

export default ContactCreatePage;
