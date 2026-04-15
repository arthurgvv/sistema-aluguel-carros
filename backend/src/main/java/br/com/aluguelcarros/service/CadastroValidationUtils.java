package br.com.aluguelcarros.service;

final class CadastroValidationUtils {

    private CadastroValidationUtils() {
    }

    static String normalizarNomePessoa(String nome) {
        String nomeNormalizado = nome.trim();
        if (nomeNormalizado.chars().anyMatch(Character::isDigit)) {
            throw new IllegalArgumentException("O nome do cliente nao pode conter numeros.");
        }
        return nomeNormalizado;
    }

    static String normalizarDocumento(String valor, String campo, int tamanhoEsperado) {
        if (valor == null || valor.isBlank()) {
            return null;
        }

        if (valor.chars().anyMatch(Character::isLetter)) {
            throw new IllegalArgumentException("O " + campo + " deve conter apenas numeros.");
        }

        String digitos = extrairDigitos(valor);
        if (digitos.length() != tamanhoEsperado) {
            throw new IllegalArgumentException("O " + campo + " deve ter " + tamanhoEsperado + " numeros.");
        }

        return digitos;
    }

    static String normalizarTextoOpcional(String valor) {
        if (valor == null) {
            return null;
        }

        String texto = valor.trim();
        return texto.isEmpty() ? null : texto;
    }

    static String extrairDigitos(String valor) {
        return valor == null ? "" : valor.replaceAll("\\D", "");
    }
}
