import { Form } from "@remix-run/react";

function LogoutButton() {
  return (
    <Form method="post" action="/logout">
      <button>Logout</button>
    </Form>
  );
}

export default LogoutButton;
