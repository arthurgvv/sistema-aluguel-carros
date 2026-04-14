package br.com.aluguelcarros.model;

public class LoginRequest {

    private String login;
    private String email; // backward compatibility alias
    private String senha;

    public LoginRequest() {
    }

    public LoginRequest(String login, String senha) {
        this.login = login;
        this.senha = senha;
    }

    /**
     * Returns the login identifier. Falls back to email for backward compatibility.
     */
    public String getLogin() {
        if (login != null && !login.isBlank()) {
            return login;
        }
        return email;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
