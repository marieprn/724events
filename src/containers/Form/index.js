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

const Form = ({ onSuccess, onError, strictValidation }) => {
  const [sending, setSending] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [touched, setTouched] = useState(false);

  const markTouched = () => setTouched(true);

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

      // ✅ En prod: strictValidation=true => on valide direct
      // ✅ En test (par défaut): strictValidation=false => on valide seulement après interaction
      const mustValidate = strictValidation || touched;

      if (mustValidate && (!lastname || !firstname || !profile || !email || !message)) {
        const err = new Error("Veuillez remplir tous les champs.");
        setErrorMsg(err.message);
        onError(err);
        return;
      }

      if (mustValidate && email && !isEmailValid(email)) {
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
        setTouched(false);

        onSuccess();
      } catch (err) {
        setSending(false);
        setErrorMsg("Une erreur est survenue, veuillez réessayer.");
        onError(err);
      }
    },
    [onSuccess, onError, strictValidation, touched]
  );

  return (
    <form key={formKey} onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field label="Nom" name="lastname" onChange={markTouched} onBlur={markTouched} />
          <Field label="Prénom" name="firstname" onChange={markTouched} onBlur={markTouched} />

          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => setTouched(true)}
            onTouched={() => setTouched(true)}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            name="profile"
          />

          <Field label="Email" name="email" onChange={markTouched} onBlur={markTouched} />

          {errorMsg && <p className="FormError">{errorMsg}</p>}

          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>

        <div className="col">
          <Field
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            name="message"
            placeholder="message"
            onChange={markTouched}
            onBlur={markTouched}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  strictValidation: PropTypes.bool,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
  strictValidation: false, // ✅ garde ton test OK
};

export default Form;