---
title: Work and school devices
description: Enroll a device in your organization, confirm sign-ins from your devices, and sign in with an organization account.
---

Sinty OS can be managed by an organization: a company, a school, or a person who
looks after the computers of their family. Everything on this page runs on
servers the organization hosts itself.

## Enrolling a device

Open **Settings**, **Organization**. Your organization gives you its address and
an enrollment code, or a single enrollment link.

1. Write the **Organization Address**, or paste the enrollment link there.
2. Write the **Enrollment Code**, if it was not in the link.
3. Give the computer a **Device Name** and choose **Enroll**.

Enrolling asks for an administrator password. The page then shows **Managed by
Your Organization**, with the organization, the device ID and the group the
device belongs to.

### What the organization can do

- **See** whether the device is up to date, its version and update channel,
  whether the data is encrypted with its keys sealed in the TPM, whether the
  firewall is on, and how much space is free.
- **Apply settings** to the groups of devices it manages, such as the update
  channel or how soon the screen locks.
- **Lock** every session, **log out**, **restart** the device, or ask it to
  **update**.
- **Erase** a lost device: the keys that open the data are discarded and the
  device restarts. Erasing needs a second administrator of the organization to
  approve it.

It cannot read your files.

Every command is signed for this one device, can be used once and expires.
Every action of the administrators goes into a signed log that cannot be changed
without it showing.

### Leaving

**Remove from Organization** takes the device out of management. It asks for an
administrator password of this computer.

## Confirming sign-ins from your devices

An organization that signs people in through Sinty Identity can ask for a strong
sign-in: a sign-in that is confirmed on one of your devices.

When you sign in on a web page or in an app of the organization, the computer you
already use shows **Sign In to ...?**, with the place the sign-in comes from. If
it is you, type the number shown on the sign-in page and choose **Allow**. If it
is not, choose **Deny**, and the sign-in fails.

The key that confirms sign-ins is created in the TPM of the computer and never
leaves it. A new computer has to be trusted first: it shows **Confirm This
Device**, and a computer you already use shows **Trust ...?**. Allow it only if
you are setting up the new one at that moment. A [Sinty Key](/docs/os/sinty-key/)
can confirm sign-ins too.

## Organization accounts in apps

Add the organization in **Settings**, **Online Accounts**. Apps that work with
the organization, such as Sinty IT and the files of Sinty Cloud, use that
account and have no password of their own. When a service asks for a stronger
sign-in, the app opens the sign-in again and your device confirms it.

## Signing in with a domain account

A computer can join a Kerberos domain, such as Active Directory, so people sign
in on the login screen with the user name and password of their organization.

The administrator creates the device account and joins the computer from the
terminal with `sinty-domain`. After that:

- The first sign-in, with the network of the organization reachable, creates a
  local account for the person, with its home encrypted exactly like any other
  account.
- Later sign-ins also work away from the office, for seven days after the last
  sign-in that reached the domain.
- An account disabled in the domain is locked on the computer as well.

The computer treats a network as the organization's network only when its
directory answers with the key recorded when the computer joined. The name of a
network never makes it a work network.
