import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      setErrorMsg("");

      const data = new FormData(evt.currentTarget);

      const lastname = (data.get("lastname") || "").toString().trim();
      const firstname = (data.get("firstname") || "").toString().trim();
      const profile = (data.get("profile") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      // champs requis
      if (!lastname || !firstname || !profile || !email || !message) {
        const err = new Error("Veuillez remplir tous les champs.");
        setErrorMsg(err.message);
        onError(err);
        return;
      }

      //  validation email
      if (!isEmailValid(email)) {
        const err = new Error("Email invalide.");
        setErrorMsg(err.message);
        onError(err);
        return;
      }

      setSending(true);

      try {
        await mockContactApi();

        setSending(false);
        setFormKey((k) => k + 1);
        setErrorMsg("");
        onSuccess();
      } catch (err) {
        setSending(false);
        setErrorMsg("Une erreur est survenue, veuillez réessayer.");
        onError(err);
      }
    },
    [onSuccess, onError]
  );

  return (
    <form key={formKey} onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field placeholder="" label="Nom" name="lastname" />
          <Field placeholder="" label="Prénom" name="firstname" />

          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            name="profile"
          />

          <Field placeholder="" label="Email" name="email" />

          {errorMsg && <p className="FormError">{errorMsg}</p>}

          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>

        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            name="message"
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;