import github from 'github';
import slack from 'slack';
import { gmail } from 'googleapis';

export default async function main({
  name,
  email
}: {
  name: string,
  email: string
}) {
  const user = await github.getUser({ name });
  await Promise.all([
    slack.sendMessage(user.name, 'Hello from Tree-sitter!'),
    gmail.sendEmail(
      'To: ' + email,
      'Hello, ' + user.name
    )
  ]);
  console.log('Email sent', { name: user.name, email });
}