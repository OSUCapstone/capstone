import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { Button, ListPlaceholder } from "../components";
import { requestPost } from "../requests";
import Routes from "../Routes";

const ContactRow = ({ contact_name, company_name, onClick }) => (
  <div
    className="flex flex-row justify-between w-full h-32 py-4 px-6 border-b border-gray-400 hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-col justify-center items-start flex-grow">
      <p className="text-lg font-medium">{contact_name}</p>
      <p className="text-sm font-medium">
        Works at <strong>{company_name}</strong>
      </p>
    </div>
  </div>
);

const ContactsPage = withRouter(({ match, history, location }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const init = async () => {
      let res = await requestPost("/api/crudContact", { crud: "readAll" });
      if (res) {
        console.log(res);
        setContacts(res);
      }
    };
    init();
  }, []);

  return (
    <div className="w-full flex flex-col flex-grow overflow-hidden">
      {/* Top level information */}
      <div className="flex flex-row justify-between items-center w-full h-20 p-4 border-b border-gray-400">
        <Button
          colorClass="bg-green-500"
          onClick={() => history.push(`${Routes.CONTACT_CREATE_PAGE}`)}
        >
          Add Contact
        </Button>
      </div>

      {/* Contacts list */}
      <div className="w-full flex-grow overflow-scroll">
        <div className="w-full flex flex-col">
          {contacts == null && <ListPlaceholder>Loading...</ListPlaceholder>}
          {contacts && contacts.length === 0 && (
            <ListPlaceholder>List Empty...</ListPlaceholder>
          )}
          {contacts &&
            contacts.length > 0 &&
            contacts.map((contact, index) => (
              <ContactRow
                key={index}
                {...contact}
                onClick={() =>
                  history.push(
                    `${Routes.CONTACTS_BASE_ROUTE}/${contact.contact_id}`
                  )
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
});

export default ContactsPage;
