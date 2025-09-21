# Doces & Sabores - Sistema de Receitas

Sistema web completo para exibição de receitas de sobremesas, desenvolvido com arquitetura distribuída em containers Docker e hospedado na AWS EC2.

## Sobre o Projeto

O **Doces & Sabores** é uma aplicação web responsiva que apresenta receitas de sobremesas de forma elegante e interativa. Desenvolvido como projeto prático para demonstrar competências em desenvolvimento full-stack, containerização e deploy em nuvem.

**🌐 [Acesse a aplicação](http://3.214.212.212:8080)**
## Demo da Aplicação

![Demo do Doces & Sabores](./frontend/video.gif)

## Arquitetura da Solução

```
Internet → [Frontend EC2] → [Backend EC2]
             ↓                ↓
         Nginx Proxy      Express API
         (Port 8080)      (Port 25000)
```

### Tecnologias Principais:

- **Frontend**: HTML5, CSS3, JavaScript ES6+, Nginx
- **Backend**: Node.js, Express.js, API REST
- **Infraestrutura**: AWS EC2, Docker, Security Groups
- **DevOps**: Containerização, Proxy Reverso, Deploy Automatizado

## Funcionalidades Implementadas

- Interface web responsiva e moderna
- Exibição de 8 receitas completas com imagens, ingredientes e preparo
- Categorização por dificuldade e tempo de preparo
- Animações e transições suaves
- Arquitetura escalável com separação de responsabilidades

## Destaques Técnicos

- **Containerização completa** com Docker para portabilidade
- **Proxy reverso** configurado para roteamento eficiente
- **Segurança implementada** com Security Groups restritivos
- **Alta disponibilidade** com restart automático dos containers
- **Separação de responsabilidades** entre frontend e backend

## Desenvolvido por

**Letícia Santiago**, **Isadora Brandão** e **Bruna França**

---

*Projeto desenvolvido para demonstrar competências em desenvolvimento full-stack, containerização Docker e deploy em nuvem AWS.*

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte de um curso de Serviços em Nuvem.
