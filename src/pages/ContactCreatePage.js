import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Heading, TextInput, Button, GeneralDropdown } from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const ContactCreatePage = withRouter(({ match, history, location }) => {
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const init = async () => {
      let res = await requestPost("/api/crudCompany", { crud: "readAll" });
      if (res) {
        setCompanies(res);
      }
    };
    init();
  }, []);

  const handleCreateContact = async () => {
    try {
      let success = await requestPost("/api/crudContact", {
        crud: "create",
        contact_name: `${contact}`,
        company_id: `${company.company_id}`,
        role: `${role}`,
        email: `${email}`,
        phone_number: `${phone}`,
      });

      if (success) {
        history.push(Routes.CONTACTS_PAGE);
      } else {
        console.log("Failed to create contact!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Heading>Add Contact</Heading>
      <div
        className="flex flex-col justify-between my-2"
        style={{ height: "250px" }}
      >
        <TextInput
          value={contact}
          setValue={setContact}
          placeholder="Contact name..."
        />
        <GeneralDropdown
          options={companies}
          selected={company}
          onSelect={setCompany}
          displayAttribute="company_name"
          placeholder="Company"
        />
        <TextInput
          value={role}
          setValue={setRole}
          placeholder="Role (ex: 'Software Engineer')"
        />
        <TextInput value={email} setValue={setEmail} placeholder="Email" />
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
